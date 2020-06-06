import {postMethod} from './service.util';

const URL_LINK = 'https://19432c36c34b.ngrok.io/';

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
    return fetch(URL_LINK + 'forgot-password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  validateForgotPassword: data => {
    return fetch(URL_LINK + 'forgot-password/validate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  changePassword: data => {
    return fetch(URL_LINK + 'change-password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },

  registerDevice: data => {
    let endPoint = 'register-device/';
    return postMethod(endPoint, data);
  },
};
