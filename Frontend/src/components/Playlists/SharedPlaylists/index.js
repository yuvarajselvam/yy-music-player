import React, {useState, useEffect, useCallback} from 'react';
import {View, Alert, InteractionManager, ScrollView} from 'react-native';
import {Button} from 'react-native-elements';
import {Colors, IconButton} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';

import {trackService} from '../../../services/track.service';
import {OverlayModal} from '../../../shared/components/OverlayModal';
// import {mockMyPlaylists} from '../../mocks/my.playlists';

import {commonStyles} from '../../common/styles';
import {styles} from '../MyPlaylists/myplaylists.styles';
import {useAuthContext} from '../../../contexts/auth.context';
import ListItems from '../../../shared/components/ListItems';
import {database} from '../../../utils/db/model';
import {Q} from '@nozbe/watermelondb';
import {playlistsSubject} from '../../../utils/db/model/sync';

export function SharedPlaylists({navigation}) {
  const [isPlaylistMenuOverlayOpen, setIsPlaylistMenuOverlayOpen] = useState(
    false,
  );
  const [sharedPlaylists, setSharedPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useState('');
  const {userInfo} = useAuthContext();

  useFocusEffect(
    React.useCallback(() => {
      getSharedPlaylistsService();
      return () => {};
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    const sharedPlaylistsSubscriber = playlistsSubject.subscribe(value => {
      getSharedPlaylistsService();
    });

    return () => sharedPlaylistsSubscriber.unsubscribe();
  }, [getSharedPlaylistsService]);

  const getSharedPlaylistsService = useCallback(() => {
    const playlistsCollection = database.collections.get('playlists');
    playlistsCollection
      .query(Q.where('owner', Q.notEq(userInfo.id)))
      .fetch()
      .then(records => {
        // console.log('Myplaylists fetch', records);
        let playlistList = records.map(playlist => {
          let data = {
            id: playlist._raw.id,
            name: playlist._raw.name,
            owner: playlist._raw.owner,
            scope: playlist._raw.scope,
            type: playlist._raw.type,
          };
          return data;
        });
        setSharedPlaylists(playlistList);
      });
  }, [userInfo.id]);

  const handlePlaylistSelect = React.useCallback(
    playlist => {
      console.log(playlist);
      navigation.navigate('Playlist', {playlistId: playlist.id});
    },
    [navigation],
  );

  const handleVerticalDotButton = React.useCallback(playlistObj => {
    setIsPlaylistMenuOverlayOpen(true);
    setPlaylistId(playlistObj.id);
  }, []);

  return (
    <View style={commonStyles.screenStyle}>
      <ScrollView>
        <ListItems
          options={sharedPlaylists}
          titleKeys={['name']}
          onPress={handlePlaylistSelect}
          rightIconName="more-vert"
          onRightIconPress={handleVerticalDotButton}
        />
      </ScrollView>
      <OverlayMenu
        playlistId={playlistId}
        isPlaylistMenuOverlayOpen={isPlaylistMenuOverlayOpen}
        setIsPlaylistMenuOverlayOpen={setIsPlaylistMenuOverlayOpen}
        getSharedPlaylistsService={getSharedPlaylistsService}
      />
    </View>
  );
}

function OverlayMenu(props) {
  const {
    isPlaylistMenuOverlayOpen,
    setIsPlaylistMenuOverlayOpen,
    getSharedPlaylistsService,
    playlistId,
  } = props;

  const {userInfo} = useAuthContext();

  const handleDeletePlaylist = () => {
    let playlist = {
      id: playlistId,
      userId: userInfo.id,
    };

    setIsPlaylistMenuOverlayOpen(false);
    trackService.deletePlaylist(playlist).then(response => {
      if (response.status === 200) {
        getSharedPlaylistsService();
        Alert.alert('Deleted!', 'Playlist deleted successfully');
      } else {
        Alert.alert('Failed!', 'Playlist cannot be deleted');
      }
    });
  };

  return (
    <OverlayModal
      position="bottom"
      visible={isPlaylistMenuOverlayOpen}
      onBackdropPress={() => setIsPlaylistMenuOverlayOpen(false)}>
      <Button
        icon={<IconButton color={Colors.grey200} icon="playlist-remove" />}
        buttonStyle={styles.overlayButtons}
        type="clear"
        title="Delete Playlist"
        titleStyle={styles.overlayButtonTitle}
        onPress={handleDeletePlaylist}
      />
      <Button
        icon={<IconButton color={Colors.grey200} icon="playlist-edit" />}
        buttonStyle={styles.overlayButtons}
        type="clear"
        title="Change Playlist Name"
        titleStyle={styles.overlayButtonTitle}
      />
    </OverlayModal>
  );
}
