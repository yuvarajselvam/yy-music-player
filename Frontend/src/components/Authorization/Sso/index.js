import React, {useReducer} from 'react';
import {View, Alert} from 'react-native';
import {Button, Image, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import {useAuthContext} from '../../../contexts/auth.context';
import {authService} from '../../../services/auth.service';
import {SSOService} from '../../../services/sso.service';
import {SOCIAL_TYPES} from '../../../utils/constants';
import {setLocalStore} from '../../../utils/funtions';

import {styles} from './sso.styles';

function reducer(state, action) {
  switch (action.type) {
    case SOCIAL_TYPES.FACEBOOK:
      return {isFBLoading: action.value};
    case SOCIAL_TYPES.GOOGLE:
      return {isGLoading: action.value};
  }
}

export function Sso({navigation}) {
  const {signIn} = useAuthContext();
  const initialState = {
    isFBLoading: false,
    isGLoading: false,
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  // const initialUserAuthentication = async loginType => {
  //   console.log('First authentication check');
  //   let localDataObj = await getLocalStore();
  //   return new Promise(async (resolve, reject) => {
  //     if (localDataObj && localDataObj.accessToken) {
  //       let email = localDataObj.email;
  //       let type = localDataObj.signInType;
  //       if (type !== loginType) {
  //         console.log('Clearing unMatched LoginType localstore');
  //         await AsyncStorage.removeItem('localStore');
  //         resolve(false);
  //       } else {
  //         let data = {
  //           email: email,
  //           accessToken: localDataObj.accessToken,
  //           idToken: localDataObj.idToken,
  //           type: type,
  //           os: 'Android',
  //         };
  //         authService
  //           .userSSO(data)
  //           .then(async response => {
  //             console.log(await response.json());
  //             if (response.status === 200) {
  //               console.log('Intial User Authentication Response');
  //               dispatch({type: loginType, value: false});
  //               signIn(email, localDataObj.accessToken);
  //               resolve(true);
  //             } else {
  //               resolve(false);
  //             }
  //           })
  //           .catch(err => {
  //             console.log(err.message);
  //           });
  //       }
  //     } else {
  //       resolve(false);
  //     }
  //   });
  // };

  const handleSSO = async type => {
    dispatch({type: type, value: true});
    try {
      let data = await SSOService(type);
      console.log('SSO data === ', data);
      authentiateUser(data);
    } catch (error) {
      Alert.alert(error);
      dispatch({type: type, value: false});
    }
  };

  const authentiateUser = data => {
    authService
      .userSSO(data)
      .then(async response => {
        if (response.status === 200 || response.status === 201) {
          let responseObj = await response.json();
          let localData = {
            userId: responseObj.userId,
            authToken: responseObj.authToken,
          };
          console.log('aunthenticate user', localData);
          await setLocalStore(localData);
          dispatch({type: data.type, value: false});
          signIn(responseObj.authToken);
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
          source={require('../../../assets/logo.png')}
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
