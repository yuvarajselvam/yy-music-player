export const videoService = {
  getLink(keyword) {
    let promise = fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${keyword}&key=AIzaSyBo_rii4kR_Px3OPadnqf9RRfaBCw_v1wg`
    )
      .then(res => res.json())
      .catch(err => Promise.reject(err));
    return promise;
  }
};
