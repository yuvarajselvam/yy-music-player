const URL_LINK = 'http://192.168.0.3:5000/';

export const authService = {
  userSSO: (data) => {
    return fetch(URL_LINK + 'sso/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  userSignIn: (data) => {
    return fetch(URL_LINK + 'signin/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  userSignup: (data) => {
    return fetch(URL_LINK + 'signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  forgotPassword: (data) => {
    return fetch(URL_LINK + 'forgot_password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  validateForgotPassword: (data) => {
    console.log(data);
    return fetch(URL_LINK + 'forgot_password/validate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  changePassword: (data) => {
    return fetch(URL_LINK + 'change_password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  getSearch: (data) => {
    return fetch(URL_LINK + 'autocomplete/' + `?searchKey=${data.searchKey}`);
  },

  getTrack: (data) => {
    return fetch(URL_LINK + 'track/' + `${data._id}`);
  },
};
