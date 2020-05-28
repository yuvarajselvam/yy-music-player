import json
from selenium.common.exceptions import TimeoutException
from seleniumwire import webdriver
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--incognito")
chrome_options.add_argument("--headless")
chrome_options.add_argument("--log-level=3")
executable_path = '../executables/chromedriver.exe'
browser = webdriver.Chrome(executable_path=executable_path, chrome_options=chrome_options)
browser.get('https://www.jiosaavn.com/song/vaathi-coming/OSJYckRBAFU')
browser.add_cookie({'name': 'web6_enabled', 'value': 'yes'})
browser.refresh()


def get_track_url(saavn_url):
    js = f'''
    var el = document.querySelector("p.o-layout__item:nth-child(1) > a:nth-child(1)");
    var elProperties = Object.getOwnPropertyNames(el);
    var reactObj = el[elProperties[0]].return.stateNode[elProperties[1]];
    reactObj.children._owner.stateNode.props.song.encrypted_media_url = "{saavn_url}";
    el.click();
    '''
    browser.execute_script(js)

    try:
        browser.wait_for_request("generateAuthToken", 15)
    except TimeoutException:
        return None
    for request in browser.requests:
        if "generateAuthToken" in request.path and request.response:
            response = json.loads(request.response.body.decode("utf-8").strip())

            if "auth_url" in response and isinstance(response["auth_url"], str) and \
                    response["auth_url"].startswith("https"):
                del browser.requests
                return response["auth_url"]
    return None

