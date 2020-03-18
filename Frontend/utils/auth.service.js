const URL_LINK = "https://yy-music-player-be.herokuapp.com/";

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
