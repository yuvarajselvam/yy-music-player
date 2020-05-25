import React, {useState} from 'react';
import {View, ToastAndroid} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {Header} from '../../../widgets/Header';
import {userService} from '../../../services/user.service';
import {useAuthContext} from '../../../contexts/auth.context';
import {ListItems} from '../../../widgets/ListItems';

export function Users(props) {
  const {navigation} = props;
  const [users, setUsers] = useState([]);

  const {userInfo} = useAuthContext();

  useFocusEffect(
    React.useCallback(() => {
      userService.getUsers().then(async response => {
        let responseObj = await response.json();
        // console.log('users list', responseObj.users);
        setUsers(responseObj.users);
      });
      return () => {
        setUsers([]);
      };
    }, []),
  );

  const handleRequest = user => {
    let userId = userInfo.id;
    let data = {
      follower: userId,
      followee: user.id,
    };
    userService.followRequest(data).then(response => {
      if (response.status === 200) {
        ToastAndroid.show('Request sent successfully', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Request failed', ToastAndroid.SHORT);
      }
    });
  };

  return (
    <View style={{flex: 1}}>
      <Header navigation={navigation} />
      <ListItems options={users} titleKeys={['name']} onPress={handleRequest} />
    </View>
  );
}
