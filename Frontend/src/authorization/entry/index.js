import React, {useContext, useReducer} from 'react';
import {View, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Button, Image, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import AuthContext from '../../contexts/auth.context';
import {authService} from '../../services/auth.service';
import {SSOService} from '../../services/sso.service';
import {SOCIAL_TYPES} from '../../utils/constants';
import {getLocalStore, setLocalStore} from '../../utils/funtions';

import {styles} from './entry.styles';

function reducer(state, action) {
  switch (action.type) {
    case SOCIAL_TYPES.FACEBOOK:
      return {isFBLoading: action.value};
    case SOCIAL_TYPES.GOOGLE:
      return {isGLoading: action.value};
  }
}

export function Entry({navigation}) {
  const {signIn} = useContext(AuthContext);
  const initialState = {
    isFBLoading: false,
    isGLoading: false,
  };
  const [state, dispatch] = useReducer(reducer, initialState);

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
                dispatch({type: loginType, value: false});
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

  const handleSSO = async type => {
    dispatch({type: type, value: true});
    initialUserAuthentication(type)
      .then(async response => {
        if (!response) {
          try {
            let data = await SSOService(type);
            console.log('SSO data === ', data);
            authentiateUser(data);
          } catch (error) {
            Alert.alert(error);
            dispatch({type: type, value: false});
          }
        }
      })
      .catch(error => {
        Alert.alert(error);
        dispatch({type: type, value: false});
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
          dispatch({type: data.type, value: false});
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
          source={require('../../assets/logo.png')}
          style={styles.logoImage}
        />
        <Button
          loading={state.isGLoading}
          loadingStyle={styles.loadingIndicator}
          loadingProps={{size: 'small'}}
          icon={
            <Icon
              name="google"
              type="font-awesome"
              size={24}
              color="white"
              style={styles.socialIcon}
            />
          }
          containerStyle={styles.socialLoginContainer}
          buttonStyle={styles.googleButton}
          titleStyle={styles.socialButtonTitle}
          title={'Continue with Google'}
          onPress={() => handleSSO(SOCIAL_TYPES.GOOGLE)}
        />
        <Button
          loading={state.isFBLoading}
          loadingStyle={styles.loadingIndicator}
          loadingProps={{size: 'small'}}
          icon={
            <Icon
              name="facebook"
              type="font-awesome"
              size={24}
              color="white"
              style={styles.socialIcon}
            />
          }
          containerStyle={styles.socialLoginContainer}
          buttonStyle={styles.facebookButton}
          titleStyle={styles.socialButtonTitle}
          title={'Continue with Facebook'}
          onPress={() => handleSSO(SOCIAL_TYPES.FACEBOOK)}
        />
        <Button
          icon={
            <Icon
              name="envelope"
              type="font-awesome"
              size={24}
              color="white"
              style={styles.socialIcon}
            />
          }
          containerStyle={styles.socialLoginContainer}
          buttonStyle={styles.emailButton}
          titleStyle={styles.socialButtonTitle}
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
