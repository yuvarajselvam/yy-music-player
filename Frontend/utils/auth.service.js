const URL_LINK = 'http://9c0a256b.ngrok.io/';

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

  search: data => {
    return fetch(URL_LINK + 'get_track_url/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },
};
