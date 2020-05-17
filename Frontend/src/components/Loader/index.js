import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {Image} from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';

import {userService} from '../../services/user.service';
import {authService} from '../../services/auth.service';
import {getLocalStore} from '../../utils/funtions';

import {styles} from './load.styles';
import {useAuthContext} from '../../contexts/auth.context';

export function Loader(props) {
  const {setIsLoaded} = props;

  const {setUserInfo, signIn, signOut} = useAuthContext();

  // Todo - need to be handle better
  useEffect(() => {
    async function getAuthInfo() {
      let localDataObj = await getLocalStore();
      return localDataObj;
    }
    getAuthInfo().then(info => {
      // console.log('userId data === ', info);
      if (!info) {
        signOut();
        return;
      }
      let userIdObj = {
        userId: info.userId,
      };
      userService.getUser(userIdObj).then(async response => {
        // console.log('Get user response', await response.json());
        if (response.status === 200) {
          signIn(info.authToken);
          let responseData = await response.json();
          let userObj = {...responseData, authToken: info.authToken};
          setUserInfo(userObj);
          setIsLoaded(true);
        } else {
          signOut();
          return;
        }
      });
      messaging()
        .getToken()
        .then(token => {
          console.log(token);
          let data = {
            userId: info.userId,
            newToken: token,
          };
          authService.registerDevice(data).then(response => {
            if (response.status === 200) {
              console.log('Device register successfully');
            }
          });
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={styles.indicator}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logoImage}
      />
      <ActivityIndicator animating={true} size="large" color="#eeeeee" />
    </View>
  );
}
