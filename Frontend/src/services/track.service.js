import {getMethod, postMethod, putMethod, deleteMethod} from './service.util';
import {getUniqueId} from 'react-native-device-info';

export const trackService = {
  getSearch: data => {
    let endPoint =
      'autocomplete/' +
      `?searchKey=${data.searchKey}` +
      `&languages=${data.languages}`;
    return getMethod(endPoint);
  },

  getTrack: async data => {
    let endPoint = 'track/' + `${data.language}/` + `${data.id}/`;
    return new Promise((resolve, reject) => {
      getMethod(endPoint).then(async response => {
        let trackData = await response.json();
        let encodedSaavnUrl = encodeURIComponent(trackData.saavnUrl);
        fetch(
          `https://www.jiosaavn.com/api.php?__call=song.generateAuthToken&url=${encodedSaavnUrl}&bitrate=128&api_version=4&_format=json&ctx=web6dot0&_marker=0`,
        )
          .then(urlResponse => urlResponse.json())
          .then(result => {
            console.log(result);
            if (result.auth_url === false) {
              reject();
            }
            trackData.trackUrl = result.auth_url;
            resolve(trackData);
          })
          .catch(err => {
            console.log(err);
          });
      });
    });
  },

  getAlbum: data => {
    let endPoint = 'album/' + `${data.language}/` + `${data.id}/`;
    return getMethod(endPoint);
  },

  createPlaylist: data => {
    let endPoint = 'playlist/create/';
    return postMethod(endPoint, data);
  },

  addToPlaylist: async data => {
    data.operation = 'addTracks';
    let endPoint = 'playlist/' + data.id + '/edit/';
    return putMethod(endPoint, data);
  },

  editPlaylist: async data => {
    let endPoint = 'playlist/' + data.id + '/edit/';
    return putMethod(endPoint, data);
  },

  removeFromPlaylist: async data => {
    data.operation = 'removeTracks';
    let endPoint = 'playlist/' + data.id + '/edit/';
    return putMethod(endPoint, data);
  },

  sharePlaylist: async data => {
    let endPoint = 'playlist/' + data.id + '/share/';
    return postMethod(endPoint, data);
  },

  getMyPlaylists: async data => {
    let endPoint = 'playlists/';
    return getMethod(endPoint);
  },

  getSharedPlaylists: async data => {
    let endPoint = 'shared-playlists/';
    return getMethod(endPoint);
  },

  getPlaylist: async data => {
    let endPoint = 'playlist/' + `${data.id}/`;
    return getMethod(endPoint);
  },

  deletePlaylist: async data => {
    let endPoint = 'playlist/' + data.id + '/delete/';
    return deleteMethod(endPoint, data);
  },

  downloadTrack: data => {
    let endPoint = 'track/' + `${data.language}/` + `${data.id}/download/`;
    const uniqueId = getUniqueId();
    data.deviceId = uniqueId;
    return postMethod(endPoint, data);
  },

  downloads: () => {
    const uniqueId = getUniqueId();
    let endPoint = 'device/' + uniqueId + '/downloads/';
    return getMethod(endPoint);
  },
};
