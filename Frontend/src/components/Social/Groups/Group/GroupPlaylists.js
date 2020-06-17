import React, {useState} from 'react';
import {View, Button} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import ListItems from '../../../../shared/components/ListItems';
import {CreatePlaylistOverlay} from '../../../../components/Playlists/MyPlaylists';
import {groupService} from '../../../../services/group.service';

export function GroupPlaylists(props) {
  const {groupId, navigation} = props;
  // const groupId = route.params.groupId;
  const [groupPlaylists, setGroupPlaylists] = useState([]);
  const [
    isCreatePlaylistOverlayOpen,
    setIsCreatePlaylistOverlayOpen,
  ] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getPlaylistService();
      return () => {};
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const getPlaylistService = () => {
    let data = {
      id: groupId,
    };
    groupService.getGroup(data).then(async response => {
      if (response.status === 200) {
        let responseData = await response.json();
        setGroupPlaylists(responseData.playlists);
      }
    });
  };

  const createPlaylist = () => {
    console.log('Creating playlist');
    setIsCreatePlaylistOverlayOpen(true);
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
      <Button title="Create playlist" onPress={createPlaylist} />
      <CreatePlaylistOverlay
        isCreatePlaylistOverlayOpen={isCreatePlaylistOverlayOpen}
        setIsCreatePlaylistOverlayOpen={setIsCreatePlaylistOverlayOpen}
        getPlaylistService={getPlaylistService}
        playlistType="group"
        ownerId={groupId}
      />
    </View>
  );
}
