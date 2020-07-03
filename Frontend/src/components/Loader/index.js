import React, {useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {Image} from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';
import {
  getUniqueId,
  getModel,
  getSystemName,
  getSystemVersion,
  getDeviceName,
  getVersion,
  getDeviceType,
} from 'react-native-device-info';

import {userService} from '../../services/user.service';
import {authService} from '../../services/auth.service';
import {getLocalStore} from '../../utils/funtions';

import {styles} from './load.styles';
import {useAuthContext} from '../../contexts/auth.context';
import {mySync} from '../../utils/db/model/sync';

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
        if (response.status === 200 || response.status === 201) {
          signIn(info.authToken);
          let responseData = await response.json();
          let userObj = {...responseData, authToken: info.authToken};
          setUserInfo(userObj);
          await mySync();
          setIsLoaded(true);
        } else {
          signOut();
          return;
        }
      });
      messaging()
        .getToken()
        .then(async token => {
          console.log(token);
          let deviceInfo = await getDeviceInfo();
          let data = {
            userId: info.userId,
            token: token,
            ...deviceInfo,
          };
          authService.registerDevice(data).then(response => {
            if (response.status === 200 || response.status === 409) {
              console.log('Device register successfull');
            } else {
              console.log('Device register unsuccessfull');
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

async function getDeviceInfo() {
  const name = await getDeviceName();
  const osName = getSystemName();
  const uniqueId = getUniqueId();
  const osVersion = getSystemVersion();
  const appVersion = getVersion();
  const deviceType = getDeviceType();
  const model = getModel();
  return {name, osName, osVersion, uniqueId, appVersion, deviceType, model};
}
