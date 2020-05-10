const URL_LINK = 'http://192.168.0.3:5000/';

export const authService = {
  userSSO: data => {
    return fetch(URL_LINK + 'sso/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  userSignIn: data => {
    return fetch(URL_LINK + 'signin/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  userSignup: data => {
    return fetch(URL_LINK + 'signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  forgotPassword: data => {
    return fetch(URL_LINK + 'forgot_password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  validateForgotPassword: data => {
    console.log(data);
    return fetch(URL_LINK + 'forgot_password/validate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  changePassword: data => {
    return fetch(URL_LINK + 'change_password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  getSearch: data => {
    return fetch(
      URL_LINK +
        'autocomplete/' +
        `?searchKey=${data.searchKey}` +
        `&languages=${data.languages}`,
    );
  },

  getTrack: data => {
    return fetch(URL_LINK + 'track/' + `${data.language}/` + `${data._id}/`);
  },

  getAlbum: data => {
    return fetch(URL_LINK + 'album/' + `${data.language}/` + `${data._id}/`);
  },

  createPlaylist: data => {
    return fetch(URL_LINK + 'playlist/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  addToPlaylist: data => {
    data.operation = 'addTracks';
    return fetch(
      URL_LINK + 'playlist/' + '5ea1c7c7b566f89fac9947a7' + '/edit/',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );
  },

  editPlaylist: data => {
    return fetch(
      URL_LINK + 'playlist/' + '5ea1c7c7b566f89fac9947a7' + '/edit/',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );
  },

  removeFromPlaylist: data => {
    data.operation = 'removeTracks';
    return fetch(
      URL_LINK + 'playlist/' + '5ea1c7c7b566f89fac9947a7' + '/edit/',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );
  },

  getMyPlaylists: data => {
    return fetch(
      URL_LINK + 'user/' + '5e7baa1a88a82254f4f8daed/' + 'playlists/',
    );
  },

  getPlaylist: data => {
    return fetch(
      URL_LINK +
        'user/' +
        '5e7baa1a88a82254f4f8daed/' +
        'playlist/' +
        `${data._id}/`,
    );
  },

  deletePlaylist: data => {
    return fetch(
      URL_LINK + 'playlist/' + '5ea1c7c7b566f89fac9947a7' + '/delete/',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );
  },
};
