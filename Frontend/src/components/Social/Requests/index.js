import React, {useState} from 'react';
import {View, ToastAndroid} from 'react-native';
import {ListItem, Button} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import {Colors} from 'react-native-paper';
import {widthPercentageToDP} from 'react-native-responsive-screen';

import {Header} from '../../../widgets/Header';

import {userService} from '../../../services/user.service';
import {useAuthContext} from '../../../contexts/auth.context';
import {styles} from './requests.styles';

export function Requests(props) {
  const {navigation} = props;
  const [pendingRequest, setPendingRequest] = useState([]);

  const {userInfo} = useAuthContext();

  useFocusEffect(
    React.useCallback(() => {
      getPendingRequestService();
      return () => {
        setPendingRequest([]);
      };
    }, []),
  );

  const getPendingRequestService = () => {
    userService.getPendingRequests().then(async response => {
      if (response.status === 200) {
        let responseObj = await response.json();
        // console.log('Pending list', responseObj);
        setPendingRequest(responseObj);
      } else {
        setPendingRequest([]);
      }
    });
  };

  const handleAcceptRequest = requester => {
    let data = {
      followee: userInfo._id,
      follower: requester.userId,
    };
    userService.acceptRequest(data).then(response => {
      if (response.status === 200) {
        getPendingRequestService();
        ToastAndroid.show('Request accepted successfully', ToastAndroid.SHORT);
      }
    });
  };

  const handleRejectRequest = requester => {
    let data = {
      followee: userInfo._id,
      follower: requester.userId,
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
        title="Notification"
        navigation={navigation}
        leftIconName="arrow-back"
        onLeftIconPress={() => navigation.goBack()}
      />

      {pendingRequest.length > 0 ? (
        pendingRequest.map(requester => {
          return (
            <ListItem
              containerStyle={styles.listContainer}
              title={requester.userId}
              titleStyle={{marginBottom: 4}}
              subtitle={
                requester.isRequester
                  ? 'Request Pending'
                  : 'Approve or ignore request'
              }
              subtitleStyle={{color: Colors.grey200}}
              rightElement={
                !requester.isRequester && (
                  <View style={{flexDirection: 'row'}}>
                    <Button
                      containerStyle={{marginRight: widthPercentageToDP(3.2)}}
                      title="accept"
                      onPress={() => handleAcceptRequest(requester)}
                    />
                    <Button
                      type="outline"
                      title="reject"
                      onPress={() => handleRejectRequest(requester)}
                    />
                  </View>
                )
              }
            />
          );
        })
      ) : (
        <ListItem
          containerStyle={styles.listContainer}
          title="No pending Request"
        />
      )}
    </View>
  );
}
