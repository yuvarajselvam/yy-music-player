import {
  getMethod,
  postMethod,
  putMethod,
  deleteMethod,
  getUserId,
} from './service.util';

export const trackService = {
  getSearch: data => {
    let endPoint =
      'autocomplete/' +
      `?searchKey=${data.searchKey}` +
      `&languages=${data.languages}`;
    return getMethod(endPoint);
  },

  getTrack: data => {
    let endPoint = 'track/' + `${data.language}/` + `${data._id}/`;
    return getMethod(endPoint);
  },

  getAlbum: data => {
    let endPoint = 'album/' + `${data.language}/` + `${data._id}/`;
    return getMethod(endPoint);
  },

  createPlaylist: data => {
    let endPoint = 'playlist/create/';
    return postMethod(endPoint, data);
  },

  addToPlaylist: async data => {
    data.operation = 'addTracks';
    let endPoint = 'playlist/' + data._id + '/edit/';
    return putMethod(endPoint, data);
  },

  editPlaylist: async data => {
    let endPoint = 'playlist/' + data._id + '/edit/';
    return putMethod(endPoint, data);
  },

  removeFromPlaylist: async data => {
    data.operation = 'removeTracks';
    let endPoint = 'playlist/' + data._id + '/edit/';
    return putMethod(endPoint, data);
  },

  getMyPlaylists: async data => {
    let userId = await getUserId();
    console.log(userId);
    let endPoint = 'user/' + userId + '/playlists/';
    return getMethod(endPoint);
  },

  getPlaylist: async data => {
    let userId = await getUserId();
    let endPoint = 'user/' + userId + '/playlist/' + `${data._id}/`;
    return getMethod(endPoint);
  },

  deletePlaylist: async data => {
    let userId = await getUserId();
    let endPoint = 'playlist/' + userId + '/delete/';
    return deleteMethod(endPoint, data);
  },
};
