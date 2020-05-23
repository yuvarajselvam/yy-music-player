import React, {useState} from 'react';
import {View} from 'react-native';
import {ListItem} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';

import {Header} from '../../../widgets/Header';
import {userService} from '../../../services/user.service';

export function Following(props) {
  const {navigation} = props;

  const [followings, setFollowings] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      userService.getFollowing().then(async response => {
        if (response.status === 200) {
          let responseObj = await response.json();
          // console.log('followings list', responseObj);
          setFollowings(responseObj.following);
        } else {
          setFollowings([{name: 'No Following'}]);
        }
      });
      return () => {
        setFollowings([]);
      };
    }, []),
  );

  return (
    <View style={{flex: 1}}>
      <Header navigation={navigation} />
      {followings.map(following => {
        return (
          <ListItem
            containerStyle={{backgroundColor: '#121212'}}
            title={following.name}
          />
        );
      })}
    </View>
  );
}
