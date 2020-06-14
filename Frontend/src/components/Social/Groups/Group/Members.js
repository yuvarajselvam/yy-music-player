import React, {useState} from 'react';
import {View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import ListItems from '../../../../widgets/ListItems';
import {groupService} from '../../../../services/group.service';
import {Button} from 'react-native-elements';

export function Members(props) {
  const {groupId} = props;

  const [members, setMembers] = useState([]);
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

  const handleInviteMember = member => {
    let data = {
      id: groupId,
      userId: member.id,
    };
    groupService.inviteMember(data).then(async response => {
      if (response.status === 200) {
        console.log('Group member invite successfully!');
      }
    });
  };

  return (
    <View>
      <ListItems
        options={members}
        titleKeys={['name']}
        emptyTitle="No members yet!"
      />
      <Button title="Invite Member" onPress={handleInviteMember} />
    </View>
  );
}
