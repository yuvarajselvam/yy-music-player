import React, {useState} from 'react';
import {View, ToastAndroid} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Button} from 'react-native-elements';

import ListItems from '../../../../shared/components/ListItems';
import {groupService} from '../../../../services/group.service';
import {userService} from '../../../../services/user.service';

import {UserModal} from '../../../../shared/components/UserModal';

export function Members(props) {
  const {groupId} = props;
  const [members, setMembers] = useState([]);
  const [
    isIniviteMembersOverlayOpen,
    setIsIniviteMembersOverlayOpen,
  ] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      let data = {
        id: groupId,
      };
      groupService.getGroup(data).then(async response => {
        if (response.status === 200) {
          let responseData = await response.json();
          setMembers(responseData.members);
        }
      });
    }, [groupId]),
  );

  const handleInviteMember = () => {
    setIsIniviteMembersOverlayOpen(true);
  };

  const handleInviteMembers = React.useCallback(
    selectedUsers => {
      let data = {
        id: groupId,
        users: selectedUsers,
      };
      groupService.inviteMember(data).then(async response => {
        setIsIniviteMembersOverlayOpen(false);
        if (response.status === 200) {
          ToastAndroid.show('Successfully shared!', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Share Unsuccessfull!', ToastAndroid.SHORT);
        }
      });
    },
    [groupId, setIsIniviteMembersOverlayOpen],
  );

  return (
    <View>
      <ListItems
        options={members}
        titleKeys={['name']}
        emptyTitle="No members yet!"
      />
      <Button title="Invite Member" onPress={handleInviteMember} />
      {isIniviteMembersOverlayOpen && (
        <UserModal
          isOpen={isIniviteMembersOverlayOpen}
          setIsOpen={setIsIniviteMembersOverlayOpen}
          onDone={handleInviteMembers}
          type="users"
        />
      )}
    </View>
  );
}
