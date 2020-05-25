import React, {useState} from 'react';
import {View, ToastAndroid} from 'react-native';
import {Button} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import {widthPercentageToDP} from 'react-native-responsive-screen';

import {Header} from '../../../widgets/Header';

import {userService} from '../../../services/user.service';
import {useAuthContext} from '../../../contexts/auth.context';
import {ListItems} from '../../../widgets/ListItems';

export function Requests(props) {
  const {navigation} = props;
  const [pendingRequests, setPendingRequests] = useState([]);

  const {userInfo} = useAuthContext();

  useFocusEffect(
    React.useCallback(() => {
      getPendingRequestService();
      return () => {
        setPendingRequests([]);
      };
    }, []),
  );

  const getPendingRequestService = () => {
    userService.getPendingRequests().then(async response => {
      if (response.status === 200) {
        let responseObj = await response.json();
        // console.log('Pending list', responseObj);
        setPendingRequests(responseObj.pendingRequests);
      } else {
        setPendingRequests([]);
      }
    });
  };

  const handleAcceptRequest = request => {
    let data = {
      followee: userInfo.id,
      follower: request.id,
    };
    userService.acceptRequest(data).then(response => {
      if (response.status === 200) {
        getPendingRequestService();
        ToastAndroid.show('Request accepted successfully', ToastAndroid.SHORT);
      }
    });
  };

  const handleRejectRequest = request => {
    let data = {
      followee: userInfo.id,
      follower: request.id,
    };
    userService.rejectRequest(data).then(response => {
      if (response.status === 200) {
        getPendingRequestService();
        ToastAndroid.show('Request rejected successfully', ToastAndroid.SHORT);
      }
    });
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title="Requests"
        navigation={navigation}
        leftIconName="arrow-back"
        onLeftIconPress={() => navigation.goBack()}
      />
      <ListItems
        options={pendingRequests}
        titleKeys={['name']}
        subtitleElement={request => {
          let subtitleText = 'Request Pending';
          if (request.type === 'received') {
            subtitleText = 'Approve or ignore request';
          }
          return subtitleText;
        }}
        rightElement={request => {
          return (
            request.type === 'received' && (
              <View style={{flexDirection: 'row'}}>
                <Button
                  containerStyle={{marginRight: widthPercentageToDP(3.2)}}
                  title="accept"
                  onPress={() => handleAcceptRequest(request)}
                />
                <Button
                  type="outline"
                  title="reject"
                  onPress={() => handleRejectRequest(request)}
                />
              </View>
            )
          );
        }}
        emptyTitle="No pending requests"
      />
    </View>
  );
}
