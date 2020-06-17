import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {View, ScrollView, Alert} from 'react-native';
import {Button, Avatar, Text} from 'react-native-elements';
import {Colors, Chip} from 'react-native-paper';

import {OverlayModal} from '../OverlayModal';
import {Header} from '../../widgets/Header';
import ListItems from '../../../shared/components/ListItems';

import {styles} from './usermodal.styles';
import {userService} from '../../../services/user.service';

UserModal.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  onDone: PropTypes.func,
  type: PropTypes.string,
};

const USER_TYPES = {
  FOLLOWERS: 'followers',
  USERS: 'users',
};

export function UserModal(props) {
  const {isOpen, setIsOpen, onDone, type} = props;

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to cancel ?', [
      {
        text: 'No',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          setIsOpen(false);
        },
      },
    ]);
  };

  useEffect(() => {
    let dataSource;
    if (type === USER_TYPES.FOLLOWERS) {
      dataSource = userService.getFollowers;
    } else if (type === USER_TYPES.USERS) {
      dataSource = userService.getUsers;
    }
    dataSource().then(async response => {
      if (response.status === 200) {
        let responseObj = await response.json();
        console.log('users list', responseObj);
        let responseUsersList = responseObj[type];
        let edittedUsersList = responseUsersList.map(value => {
          value.isSelect = false;
          return value;
        });
        setUsers(edittedUsersList);
      }
    });
    return () => {
      setUsers([]);
    };
  }, [type]);

  const handleUserSelect = React.useCallback(
    follower => {
      console.log('HANDLE USER SELECT CALLING!');
      if (selectedUsers.includes(follower) && follower.isSelect) {
        let filteredSelectedFollowers = selectedUsers.filter(
          selectedFollower => selectedFollower.id !== follower.id,
        );
        setSelectedUsers(filteredSelectedFollowers);
      } else {
        setSelectedUsers(prev => [...prev, follower]);
      }
      if (users.includes(follower)) {
        follower.isSelect = !follower.isSelect;

        let selectedIndex = users.indexOf(follower);
        let updatedFollowersList = [...users];
        updatedFollowersList[selectedIndex] = follower;
        setUsers(updatedFollowersList);
      }
    },
    [users, selectedUsers],
  );

  const selectedItemStyle = {
    backgroundColor: Colors.deepPurpleA700,
    opacity: 0.9,
  };

  return (
    <OverlayModal backHandler={backAction} visible={isOpen} fullScreen={true}>
      <View>
        <Header
          title="Invite Members"
          subtitle={
            selectedUsers.length > 0
              ? selectedUsers.length + ' users selected'
              : 'select user(s)'
          }
          leftIconName="arrow-back"
          onLeftIconPress={() => setIsOpen(false)}
          rightIconName="search"
        />
        {selectedUsers.length > 0 && (
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
            <View style={styles.selectedMembersContainer}>
              {selectedUsers.map(follower => {
                return (
                  <Chip
                    style={{margin: 2}}
                    avatar={
                      <Avatar
                        rounded
                        source={{
                          uri:
                            'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                        }}
                        onPress={() => console.log('Works!')}
                        activeOpacity={0.7}
                      />
                    }
                    onClose={() => handleUserSelect(follower)}>
                    <Text
                      style={{color: Colors.grey800}}
                      ellipsizeMode="middle">
                      {follower.name}
                    </Text>
                  </Chip>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <ScrollView>
          <ListItems
            options={users}
            titleKeys={['name']}
            onPress={handleUserSelect}
            listSelectedStyle={selectedItemStyle}
            emptyTitle="No Followers"
          />
        </ScrollView>
        <Button title="Invite Members" onPress={() => onDone(selectedUsers)} />
      </View>
    </OverlayModal>
  );
}
