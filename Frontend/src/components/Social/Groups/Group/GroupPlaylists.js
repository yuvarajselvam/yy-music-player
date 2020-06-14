import React, {useState} from 'react';
import {View, Button} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import ListItems from '../../../../widgets/ListItems';
import {groupService} from '../../../../services/group.service';
import {trackService} from '../../../../services/track.service';

export function GroupPlaylists(props) {
  const {groupId, navigation} = props;
  // const groupId = route.params.groupId;
  const [groupPlaylists, setGroupPlaylists] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      let data = {
        id: groupId,
      };
      groupService.getGroup(data).then(async response => {
        if (response.status === 200) {
          let responseData = await response.json();
          setGroupPlaylists(responseData.playlists);
        }
      });
    }, [groupId]),
  );

  const handleCreatePlaylist = playlist => {
    let data = {
      name: 'Yadhu',
      owner: groupId,
      scope: 'private',
      type: 'group',
    };
    trackService.createPlaylist(data).then(async response => {
      if (response.status === 201) {
        console.log('Group Playlist created successfully!');
      }
    });
  };

  return (
    <View style={{flex: 1}}>
      <ListItems
        options={groupPlaylists}
        titleKeys={['name']}
        emptyTitle="No playlists found"
        onPress={playlist =>
          navigation.navigate('Playlist', {playlistId: playlist.id})
        }
      />
      <Button title="Create playlist" onPress={handleCreatePlaylist} />
    </View>
  );
}
