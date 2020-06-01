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
    let endPoint = 'track/' + `${data.language}/` + `${data.id}/`;
    return getMethod(endPoint);
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
    let userId = await getUserId();
    let endPoint = 'user/' + userId + '/playlists/';
    return getMethod(endPoint);
  },

  getSharedPlaylists: async data => {
    let userId = await getUserId();
    let endPoint = 'user/' + userId + '/shared-playlists/';
    return getMethod(endPoint);
  },

  getPlaylist: async data => {
    let userId = await getUserId();
    let endPoint = 'user/' + userId + '/playlist/' + `${data.id}/`;
    return getMethod(endPoint);
  },

  deletePlaylist: async data => {
    let endPoint = 'playlist/' + data.id + '/delete/';
    return deleteMethod(endPoint, data);
  },
};
