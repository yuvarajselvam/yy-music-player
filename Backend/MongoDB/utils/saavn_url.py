import json
import time
import logging
from selenium.common.exceptions import TimeoutException
from seleniumwire import webdriver
from selenium.webdriver.chrome.options import Options
logging.basicConfig(level=logging.DEBUG)
website_URL = "https://www.jiosaavn.com/album/aadu-puli/rl-mYe9,u6g_"

chrome_options = Options()
chrome_options.add_argument("--incognito")
chrome_options.add_argument("--headless")
chrome_options.add_argument("--log-level=3")
executable_path = 'executables/chromedriver.exe'

browser = webdriver.Chrome(executable_path=executable_path, chrome_options=chrome_options)
browser.get(website_URL)


def get_track_url(const_url):
    browser.requests.clear()
    js = f'''
            var song = {{addTime: 1588614982751,
        album: "Kadaram Kondan",
        album_url: "https://www.jiosaavn.com/album/kadaram-kondan/-EcHdKWYVTY_",
        autoplay: 0,
        duration: "228",
        e_songid: "IyUzVzFbXWQ",
        has_rbt: "false",
        id: "2ec3430b-b25e-4396-8d7a-f99d08bf9097",
        image_url: "https://c.saavncdn.com/640/Kadaram-Kondan-Tamil-2019-20190717173037-150x150.jpg",
        is_playable: true,
        label: "Muzik 247",
        label_url: "/label/muzik-247-albums/MRRxocH6ZAE_",
        language: "tamil",
        last_fetched: 1588614982782,
        liked: "false",
        map: "Ghibran^~^/artist/ghibran-songs/d6FS0UbjaDY_^~^Sid Sriram^~^/artist/sid-sriram-songs/634AK8t6tAU_^~^Viveka^~^/artist/viveka-songs/XXSx4oaW1SI_",
        music: "Ghibran",
        origin: "none",
        origin_val: "",
        page: 1,
        pass_album_ctx: "true",
        perma_url: "https://www.jiosaavn.com/song/thaarame-thaarame/IyUzVzFbXWQ",
        publish_to_fb: true,
        singers: "Ghibran, Sid Sriram, Ghibran",
        songid: "SMXfEkjW",
        starred: "false",
        starring: "",
        streaming_source: null,
        tiny_url: "https://www.jiosaavn.com/song/thaarame-thaarame/IyUzVzFbXWQ",
        title: "Thaarame Thaarame",
        url: "{const_url}",
        year: "2019"}};
        Player.playSong(song, 128);
            '''
    # State.addSong(song, "queue", 1);
    browser.execute_script(js)
    try:
        browser.wait_for_request("https://aa.cf.saavncdn.com", 15)
    except TimeoutException:
        print("Request did not come.")
        return None
    for request in browser.requests:
        if request.path == 'https://www.jiosaavn.com/api.php' and request.response:
            response = json.loads(request.response.body.decode("utf-8").strip())

            if "auth_url" in response and isinstance(response["auth_url"], str) and \
                    "https://aa.cf.saavncdn.com" in response["auth_url"]:
                del browser.requests
                return response["auth_url"]
            else:
                print(response)
    return None
