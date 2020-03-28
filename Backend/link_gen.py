import youtube_dl

import requests
# from bs4 import BeautifulSoup
import time


ydl_opts = {
    'nocheckcertificate': True,
    'format': 'bestaudio/best',
    'outtmpl': '~/Yadhu/personal/music-ytd/YTdownload/songs/%(title)s.%(ext)s',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '320',
    }],
    'skip_download': 'true',
    'default_search': 'ytsearch',
    'quiet': "true"
}

start_time = time.time()
with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    #res = ydl.extract_info("Enter search term or link here...", download=False)
    res = ydl.extract_info("https://www.youtube.com/watch?v=f3qvrOjOD9M", download=False)
    print(res)

print(time.time()-start_time)
    # URL = res["entries"][0]["channel_url"]
    # r = requests.get(URL)
    # soup = BeautifulSoup(r.content)
    # print(soup.prettify())
    # verified = soup.find_all(attrs={'class': 'style-scope ytd-badge-supported-renderer'})
    # print(verified)
