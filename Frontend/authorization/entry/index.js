import React, {useContext} from 'react';
import {View, Alert, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Button, Image, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {GoogleSignin} from 'react-native-google-signin';

import AuthContext from '../../contexts/auth.context';
import {authService} from '../../utils/auth.service';
import {SOCIAL_TYPES} from '../../utils/constants';
import {getLocalStore, setLocalStore} from '../../utils/funtions';

import {styles} from '../auth.styles';

export function Entry({navigation}) {
  const {signIn} = useContext(AuthContext);

  const initialUserAuthentication = async loginType => {
    console.log('First authentication check');
    let localDataObj = await getLocalStore();
    return new Promise(async (resolve, reject) => {
      if (localDataObj && localDataObj.accessToken) {
        let email = localDataObj.email;
        let type = localDataObj.signInType;
        if (type !== loginType) {
          console.log('Clearing unMatched LoginType localstore');
          await AsyncStorage.removeItem('localStore');
          resolve(false);
        } else {
          let data = {
            email: email,
            accessToken: localDataObj.accessToken,
            idToken: localDataObj.idToken,
            type: type,
            os: 'Android',
          };
          authService
            .userSSO(data)
            .then(async response => {
              console.log(await response.json());
              if (response.status === 200) {
                console.log('Intial User Authentication Response');
                signIn(email, localDataObj.accessToken);
                resolve(true);
              } else {
                resolve(false);
              }
            })
            .catch(err => {
              console.log(err.message);
            });
        }
      } else {
        resolve(false);
      }
    });
  };

  const signInWithGoogle = async () => {
    initialUserAuthentication(SOCIAL_TYPES.GOOGLE)
      .then(async response => {
        console.log('signInWithGoogle calling!', response);
        if (!response) {
          console.log('GoogleSignIn');
          // console.log(await GoogleSignin.getCurrentUser());
          try {
            await GoogleSignin.configure({
              webClientId:
                '156841541425-huk5t0djuibtbq972s5s901v9d1ebav5.apps.googleusercontent.com',
              iosClientId:
                '156841541425-5iehdba23m6iejp3bbi40b5d2dfr7emn.apps.googleusercontent.com',
            });
            GoogleSignin.signIn().then(
              async result => {
                console.log('Google', result.user);
                let tokenObject = await GoogleSignin.getTokens();
                console.log(tokenObject);
                let name = result.user.name;
                let email = result.user.email;
                let id = result.user.id;
                let idToken = tokenObject.idToken;
                let accessToken = tokenObject.accessToken;
                let data = {
                  type: 'google',
                  accessToken: accessToken,
                  idToken: idToken,
                  id: id,
                  fullName: name,
                  email: email,
                  os: 'Android',
                };
                authentiateUser(data);
              },
              error => {
                console.log(error);
              },
            );
          } catch (e) {
            console.log(e);
          }
        }
      })
      .catch(error => {
        Alert.alert(error);
      });
  };

  const signInWithFacebook = () => {
    initialUserAuthentication(SOCIAL_TYPES.FACEBOOK).then(response => {
      console.log('signInWithFacebook calling!');
      if (!response) {
        try {
          if (Platform.OS === 'android') {
            console.log('is auth===');
            LoginManager.setLoginBehavior('web_only');
          }
          LoginManager.logInWithPermissions(['email', 'public_profile'])
            .then(result => {
              if (!result.isCancelled) {
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
                      let data = {
                        type: 'facebook',
                        accessToken: token,
                        id: userData.id,
                        fullName: userData.name,
                        email: userData.email,
                        os: 'Android',
                      };
                      authentiateUser(data);
                      console.log('Final Result', userData, accessData);
                    },
                  );
                  new GraphRequestManager().addRequest(infoRequest).start();
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
        } catch (e) {
          Alert.alert(e);
        }
      }
    });
  };

  const authentiateUser = data => {
    authService
      .userSSO(data)
      .then(async response => {
        console.log('authenticateUser calling ===', await response.json());
        if (response.status === 200 || response.status === 201) {
          let localData = {
            email: data.email,
            accessToken: data.accessToken,
            signInType: data.type,
            idToken: data.idToken,
          };
          // console.log("aunthenticate user", localData);
          await setLocalStore(localData);
          signIn(data.email, data.accessToken);
        }
      })
      .catch(err => {
        console.log(err.message);
        Alert.alert('Failed!', err.message);
      });
  };

  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.socialMain}>
      <View style={styles.entryContainer}>
        <Image
          source={require('../../assets/logo6.png')}
          style={styles.logoImage}
        />
        <Button
          icon={
            <View style={styles.iconContainStyle}>
              <Icon
                name="facebook-square"
                type="font-awesome"
                size={26}
                color="white"
                style={styles.socialIcon}
              />
            </View>
          }
          containerStyle={styles.socialLoginContainer}
          buttonStyle={styles.facebookButton}
          titleStyle={styles.socialButtonTitle}
          solid
          title={'Continue with Facebook'}
          onPress={() => signInWithFacebook(SOCIAL_TYPES.FACEBOOK)}
        />
        <Button
          icon={
            <View style={styles.iconContainStyle}>
              <Icon
                name="google"
                type="font-awesome"
                size={26}
                color="white"
                style={styles.socialIcon}
              />
            </View>
          }
          containerStyle={styles.socialLoginContainer}
          buttonStyle={styles.googleButton}
          titleStyle={styles.socialButtonTitle}
          solid
          title={'Continue with Google'}
          onPress={() => signInWithGoogle(SOCIAL_TYPES.GOOGLE)}
        />
        <Button
          icon={
            <View style={styles.iconContainStyle}>
              <Icon
                name="envelope"
                type="font-awesome"
                size={26}
                color="white"
                style={styles.socialIcon}
              />
            </View>
          }
          iconContainerStyle={styles.facebookIcon}
          containerStyle={styles.socialLoginContainer}
          buttonStyle={styles.emailButton}
          titleStyle={styles.socialButtonTitle}
          solid
          title={'Continue with Email'}
          onPress={() => navigation.navigate('Login')}
        />
        <View style={styles.entrySignUpContainer}>
          <Text style={styles.dontHaveAccount}>Don't have an account?</Text>
          <Button
            title="Sign Up"
            titleStyle={styles.signUpButtonTitle}
            type="clear"
            onPress={handleSignUp}
          />
        </View>
      </View>
    </View>
  );
}
