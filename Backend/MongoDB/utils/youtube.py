from youtube_dl import YoutubeDL

ydl_opts = {
    'nocheckcertificate': True,
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '320',
    }],
    'skip_download': 'true',
    'default_search': 'ytsearch',
    'quiet': "true"
}


def getVideoURL(keyword):
    ydl_opts["default_search"] = "ytsearch"
    with YoutubeDL(ydl_opts) as ydl:
        # ydl.cache.remove()
        res = ydl.extract_info(keyword + " song", download=False)
    if "entries" in res:
        video_url = res["entries"][0]['url']
        webpage_url = res["entries"][0]["webpage_url"]
    else:
        video_url = res["url"]
        webpage_url = res["webpage_url"]
    if "manifest" not in video_url:
        return video_url, webpage_url
    else:
        ydl_opts["default_search"] = "ytsearch2"
        with YoutubeDL(ydl_opts) as ydl:
            res = ydl.extract_info(keyword, download=False)
        if "entries" in res:
            video_url = res["entries"][0]['url']
            webpage_url = res["entries"][0]["webpage_url"]
        else:
            video_url = res["url"]
            webpage_url = res["webpage_url"]
        for video in res["entries"]:
            if "manifest" not in video_url:
                return video_url, webpage_url
        raise FileNotFoundError
