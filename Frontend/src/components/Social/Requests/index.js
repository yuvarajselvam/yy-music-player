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
        title="Notification"
        navigation={navigation}
        leftIconName="arrow-back"
        onLeftIconPress={() => navigation.goBack()}
      />

      {pendingRequests.length > 0 ? (
        pendingRequests.map(request => {
          let approver = false;
          let subtitleText = 'Request Pending';
          if (request.type === 'received') {
            approver = true;
            subtitleText = 'Approve or ignore request';
          }
          return (
            <ListItem
              containerStyle={styles.listContainer}
              title={request.name}
              titleStyle={{marginBottom: 4}}
              subtitle={subtitleText}
              subtitleStyle={{color: Colors.grey200}}
              rightElement={
                approver && (
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
