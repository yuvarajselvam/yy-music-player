import json
import time
import urllib.parse
from threading import BoundedSemaphore, Lock, Thread
from selenium.common.exceptions import TimeoutException
from seleniumwire import webdriver
from selenium.webdriver.chrome.options import Options

from utils.logging import Logger

logger = Logger('browser_service').logger


class BrowserService:
    chrome_options = Options()
    chrome_options.add_argument("--incognito")
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--log-level=3")
    executable_path = '../executables/chromedriver.exe'
    browser_pool = []
    count = 0
    semaphore = None
    lock = None

    @classmethod
    def start_browser(cls):
        browser = webdriver.Chrome(executable_path=cls.executable_path,
                                   chrome_options=cls.chrome_options)
        browser.get("https://www.jiosaavn.com/sitemap.php")
        browser.add_cookie({'name': 'web6_enabled', 'value': 'yes'})
        browser.get('https://www.jiosaavn.com/song/kamar-se-jab-sarke-sadiya/FRtZY0RbRQs')
        js = "document.querySelector('p.o-layout__item:nth-child(1) > a:nth-child(1)').click();"
        browser.execute_script(js)
        del browser.requests
        with cls.lock:
            cls.browser_pool.append(browser)

    @classmethod
    def initialize(cls, count):
        cls.count = count
        thread_list = []
        cls.semaphore = BoundedSemaphore(count)
        cls.lock = Lock()

        for i in range(count):
            t = Thread(target=cls.start_browser)
            thread_list.append(t)
            t.start()

        for t in thread_list:
            t.join()

    @classmethod
    def get_track_url(cls, saavn_url):
        start = time.time()
        browser = None
        cls.semaphore.acquire()
        try:
            with cls.lock:
                browser = cls.browser_pool.pop()

            js = f'''
                var el = document.querySelector("p.o-layout__item:nth-child(1) > a:nth-child(1)");
                var elProperties = Object.getOwnPropertyNames(el);
                var reactObj = el[elProperties[0]].return.stateNode[elProperties[1]];
                reactObj.children._owner.stateNode.props.song.encrypted_media_url = "{saavn_url}";
                el.click();
                '''
            del browser.requests
            try:
                browser.execute_script(js)
            except Exception as e:
                logger.debug(f"JS Error: {str(e)}")
                browser.save_screenshot('screenshot.png')
                with cls.lock:
                    cls.browser_pool.append(browser)
                return None

            try:
                browser.wait_for_request("generateAuthToken", 15)
            except TimeoutException:
                with cls.lock:
                    cls.browser_pool.append(browser)
                return None
            for request in browser.requests:
                if urllib.parse.quote_plus(saavn_url) in request.path and request.response:
                    response = json.loads(request.response.body.decode("utf-8").strip())
                    if "auth_url" in response and isinstance(response["auth_url"], str) and \
                            response["auth_url"].startswith("https"):
                        del browser.requests
                        with cls.lock:
                            cls.browser_pool.append(browser)
                        return response["auth_url"]
            with cls.lock:
                cls.browser_pool.append(browser)
            return None
        finally:
            print(time.time() - start)
            cls.semaphore.release()
