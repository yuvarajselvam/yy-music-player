import React, {useState} from 'react';
import {View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {Header} from '../../../widgets/Header';
import ListItems from '../../../widgets/ListItems';
import {groupService} from '../../../services/group.service';
import {Button} from 'react-native-elements';

export function Groups(props) {
  const {navigation} = props;
  const [groups, setGroups] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      groupService.getGroups().then(async response => {
        if (response.status === 200) {
          let responseData = await response.json();
          console.log('get groups', responseData.groups);
          setGroups(responseData.groups);
        }
      });
    }, []),
  );

  const handleGroupSelect = group => {
    navigation.navigate('Group', {groupId: group.id});
  };

  const handleCreateGroup = () => {
    let data = {
      scope: 'private',
      name: 'Yadhu' + Math.random(),
    };
    groupService.createGroup(data).then(response => {
      if (response.status === 201) {
        console.log('Group created successfully');
      }
    });
  };

  return (
    <View style={{flex: 1}}>
      <Header title={'Groups'} navigation={navigation} />
      <ListItems
        options={groups}
        titleKeys={['name']}
        onPress={handleGroupSelect}
        emptyTitle="You are not part of any groups"
      />
      <Button title="Create Group" onPress={handleCreateGroup} />
    </View>
  );
}
