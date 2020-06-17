import React, {useState} from 'react';
import {View, ToastAndroid} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import {widthPercentageToDP} from 'react-native-responsive-screen';

import {Header} from '../../../shared/widgets/Header';

import {userService} from '../../../services/user.service';
import {useAuthContext} from '../../../contexts/auth.context';
import ListItems from '../../../shared/components/ListItems';
import {groupService} from '../../../services/group.service';

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
        console.log('Pending list', responseObj);
        setPendingRequests(responseObj.pendingRequests);
      } else {
        setPendingRequests([]);
      }
    });
  };

  const handleAcceptRequest = React.useCallback(request => {
    if (request.type === 'group') {
      let data = {
        id: request.groupId,
        userId: request.id,
      };
      groupService.acceptInvite(data).then(response => {
        if (response.status === 200) {
          ToastAndroid.show(
            'Request accepted successfully',
            ToastAndroid.SHORT,
          );
        }
      });
    } else {
      let data = {
        followee: userInfo.id,
        follower: request.id,
      };
      userService.acceptRequest(data).then(response => {
        if (response.status === 200) {
          getPendingRequestService();
          ToastAndroid.show(
            'Request accepted successfully',
            ToastAndroid.SHORT,
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRejectRequest = React.useCallback(request => {
    if (request.type === 'group') {
      let data = {
        id: request.groupId,
        userId: request.id,
      };
      groupService.rejectInvite(data).then(response => {
        if (response.status === 200) {
          ToastAndroid.show(
            'Request rejected successfully',
            ToastAndroid.SHORT,
          );
        }
      });
    } else {
      let data = {
        followee: userInfo.id,
        follower: request.id,
      };
      userService.rejectRequest(data).then(response => {
        if (response.status === 200) {
          getPendingRequestService();
          ToastAndroid.show(
            'Request rejected successfully',
            ToastAndroid.SHORT,
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        titleKeys={['name', 'groupName']}
        subtitleElement={request => {
          let subtitleText = 'Request Pending';
          if (!request.isSender) {
            subtitleText = 'Approve or ignore request';
          }
          return <Text>{subtitleText}</Text>;
        }}
        rightElement={request => {
          return (
            !request.isSender && (
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
