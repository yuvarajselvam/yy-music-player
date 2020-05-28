import React, {useState} from 'react';
import {View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {Header} from '../../../widgets/Header';
import {userService} from '../../../services/user.service';
import ListItems from '../../../widgets/ListItems';

export function Followers(props) {
  const {navigation} = props;

  const [followers, setFollowers] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      userService.getFollowers().then(async response => {
        if (response.status === 200) {
          let responseObj = await response.json();
          // console.log('followers list', responseObj);
          setFollowers(responseObj.followers);
        } else {
          setFollowers([{name: 'No Followers'}]);
        }
      });
      return () => {
        setFollowers([]);
      };
    }, []),
  );

  return (
    <View style={{flex: 1}}>
      <Header navigation={navigation} />
      <ListItems options={followers} titleKeys={['name']} />
    </View>
  );
}
