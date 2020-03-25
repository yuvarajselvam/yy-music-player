import {Platform} from 'react-native';
import {GoogleSignin} from 'react-native-google-signin';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

import {SOCIAL_TYPES} from '../utils/constants';

export const SSOService = type => {
  if (type === SOCIAL_TYPES.FACEBOOK) {
    let data;
    const fbServiceCallback = userData => {
      data = userData;
    };
    return facebookService(type, fbServiceCallback).then(response => {
      if (response) {
        return data;
      } else {
        return response;
      }
    });
  } else {
    return googleService(type);
  }
};

const facebookService = (type, fbServiceCallback) => {
  return new Promise(async (resolve, reject) => {
    if (Platform.OS === 'android') {
      LoginManager.setLoginBehavior('web_only');
    }
    let result = await LoginManager.logInWithPermissions([
      'email',
      'public_profile',
    ]);
    if (!result.isCancelled) {
      console.log('Facebook Result not cancelled');
      AccessToken.getCurrentAccessToken().then(accessData => {
        let token = accessData.accessToken;
        const infoRequest = new GraphRequest(
          '/me',
          {
            accessToken: token,
            parameters: {
              fields: {string: 'id, name, email'},
            },
          },
          (error, userData) => {
            let obj = {
              type: type,
              accessToken: token,
              id: userData.id,
              fullName: userData.name,
              email: userData.email,
              os: 'Android',
            };
            fbServiceCallback(obj);
            resolve(true);
          },
        );
        new GraphRequestManager().addRequest(infoRequest).start();
      });
    } else {
      reject('Authorization Failed');
    }
  });
};

const googleService = async type => {
  await GoogleSignin.configure({
    webClientId:
      '156841541425-huk5t0djuibtbq972s5s901v9d1ebav5.apps.googleusercontent.com',
    iosClientId:
      '156841541425-5iehdba23m6iejp3bbi40b5d2dfr7emn.apps.googleusercontent.com',
  });
  // console.log(await GoogleSignin.getCurrentUser());
  let result = await GoogleSignin.signIn();
  let tokenObject = await GoogleSignin.getTokens();
  let name = result.user.name;
  let email = result.user.email;
  let id = result.user.id;
  let idToken = tokenObject.idToken;
  let accessToken = tokenObject.accessToken;
  let data = {
    type: type,
    accessToken: accessToken,
    idToken: idToken,
    id: id,
    fullName: name,
    email: email,
    os: 'Android',
  };
  return data;
};
