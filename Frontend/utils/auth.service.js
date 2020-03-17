const URL_LINK = "http://192.168.0.9:5000/";

export const authService = {
  userSSO: data => {
    return fetch(URL_LINK + "sso/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  },

  userSignIn: data => {
    return fetch(URL_LINK + "signin/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  },

  userSignup: data => {
    return fetch(URL_LINK + "signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  }
};
