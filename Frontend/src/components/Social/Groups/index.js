import React, {useState} from 'react';
import {View, Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {Header} from '../../../shared/widgets/Header';
import ListItems from '../../../shared/components/ListItems';
import {groupService} from '../../../services/group.service';
import {Button} from 'react-native-elements';
import {OverlayModal} from '../../../shared/components/OverlayModal';
import {InputBox} from '../../../shared/widgets/InputBox';

export function Groups(props) {
  const {navigation} = props;
  const [groups, setGroups] = useState([]);

  const [isCreateGroupOverlayOpen, setIsCreateGroupOverlayOpen] = useState(
    false,
  );

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

  return (
    <View style={{flex: 1}}>
      <Header title={'Groups'} navigation={navigation} />
      <ListItems
        options={groups}
        titleKeys={['name']}
        onPress={handleGroupSelect}
        emptyTitle="You are not part of any groups"
      />
      <Button
        title="Create Group"
        onPress={() => setIsCreateGroupOverlayOpen(true)}
      />
      {isCreateGroupOverlayOpen && (
        <CreateGroupOverlay
          isCreateGroupOverlayOpen={isCreateGroupOverlayOpen}
          setIsCreateGroupOverlayOpen={setIsCreateGroupOverlayOpen}
        />
      )}
    </View>
  );
}

export function CreateGroupOverlay(props) {
  const {isCreateGroupOverlayOpen, setIsCreateGroupOverlayOpen} = props;

  const [errorMessage, setErrorMessage] = useState('');
  const [groupName, setGroupName] = useState('');

  const handleBackdropPress = () => {
    setIsCreateGroupOverlayOpen(false);
    setGroupName('');
  };

  const handleCreateGroup = () => {
    let data = {
      scope: 'private',
      name: groupName,
    };
    groupService.createGroup(data).then(response => {
      setIsCreateGroupOverlayOpen(false);
      if (response.status === 201) {
        Alert.alert('Created!', 'Group created successfully');
      } else {
        Alert.alert('Failed!', 'Group cannot be created');
      }
    });
  };

  const handleGroupName = value => {
    if (groupName.length >= 1) {
      setErrorMessage('');
    }
    setGroupName(value);
  };

  return (
    <OverlayModal
      visible={isCreateGroupOverlayOpen}
      onBackdropPress={handleBackdropPress}>
      <View style={{justifyContent: 'space-evenly', padding: 16}}>
        <InputBox
          errorMessage={errorMessage}
          erro
          value={groupName}
          onChangeText={handleGroupName}
          disabledInputStyle={false}
          style={{padding: 0, margin: 0}}
          type={'text'}
          label={'Group Name'}
        />
        <Button title={'Create'} onPress={handleCreateGroup} />
      </View>
    </OverlayModal>
  );
}
