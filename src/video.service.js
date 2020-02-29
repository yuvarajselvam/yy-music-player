export const videoService = {
    getLink(keyword){
        let promise = fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${keyword}&key=AIzaSyDGqsUprWi3Rol5FqKb1fNDX-zRyGfgZMc`)
        .then(res => res.json())
        .catch(err => Promise.reject(err));
        return promise;
    }
}