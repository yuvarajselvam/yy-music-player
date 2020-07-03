import React, {useState, useEffect, useCallback} from 'react';
import {View, Alert, InteractionManager, ScrollView} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {Colors, Switch, IconButton} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {Q} from '@nozbe/watermelondb';

import {InputBox} from '../../../shared/widgets/InputBox';
import {trackService} from '../../../services/track.service';
import {OverlayModal} from '../../../shared/components/OverlayModal';

// import {mockMyPlaylists} from '../../../mocks/my.playlists';
import {useAuthContext} from '../../../contexts/auth.context';
import ListItems from '../../../shared/components/ListItems';

import {mySync, playlistsSubject} from '../../../utils/db/model/sync';
import {database} from '../../../utils/db/model';
import {getUniqueId} from 'react-native-device-info';

import {commonStyles} from '../../common/styles';
import {styles} from './myplaylists.styles';

const SCOPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

const PLAYLIST_TYPES = {
  USER: 'user',
  GROUP: 'group',
};

export function MyPlaylists({navigation}) {
  console.log('My playlists initialize');
  const [
    isCreatePlaylistOverlayOpen,
    setIsCreatePlaylistOverlayOpen,
  ] = useState(false);
  const [isPlaylistMenuOverlayOpen, setIsPlaylistMenuOverlayOpen] = useState(
    false,
  );
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useState('');

  const {userInfo} = useAuthContext();

  useFocusEffect(
    React.useCallback(() => {
      getPlaylistService();
      return () => {};
    }, [getPlaylistService]),
  );

  useEffect(() => {
    const playlistsSubscriber = playlistsSubject.subscribe(value => {
      console.log('Playlists changes subscriber!!!!!', value);
      getPlaylistService();
    });
    return () => playlistsSubscriber.unsubscribe();
  }, [getPlaylistService]);

  const getPlaylistService = useCallback(() => {
    const playlistsCollection = database.collections.get('playlists');
    playlistsCollection
      .query(Q.where('owner', userInfo.id))
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
        setPlaylists(playlistList);
      });
  }, [userInfo.id]);

  const createPlaylist = () => {
    console.log('Creating playlist');
    setIsCreatePlaylistOverlayOpen(true);
  };

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
      {/* <Header navigation={navigation} title="My Playlists" /> */}
      <View style={{alignItems: 'center', padding: 12}}>
        <Button title="Create Playlist" onPress={createPlaylist} />
      </View>
      <ScrollView>
        <ListItems
          options={playlists}
          titleKeys={['name']}
          onPress={handlePlaylistSelect}
          rightIconName="more-vert"
          onRightIconPress={handleVerticalDotButton}
        />
      </ScrollView>
      <CreatePlaylistOverlay
        isCreatePlaylistOverlayOpen={isCreatePlaylistOverlayOpen}
        setIsCreatePlaylistOverlayOpen={setIsCreatePlaylistOverlayOpen}
        getPlaylistService={getPlaylistService}
        ownerId={userInfo.id}
      />
      <OverlayMenu
        playlistId={playlistId}
        isPlaylistMenuOverlayOpen={isPlaylistMenuOverlayOpen}
        setIsPlaylistMenuOverlayOpen={setIsPlaylistMenuOverlayOpen}
        getPlaylistService={getPlaylistService}
      />
    </View>
  );
}

export function CreatePlaylistOverlay(props) {
  const {
    isCreatePlaylistOverlayOpen,
    setIsCreatePlaylistOverlayOpen,
    getPlaylistService,
    playlistType = PLAYLIST_TYPES.USER,
    ownerId,
  } = props;

  const [isPublic, setIsPublic] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [playlistName, setPlaylistName] = useState('');

  const handleBackdropPress = () => {
    setIsCreatePlaylistOverlayOpen(false);
    setPlaylistName('');
    setIsPublic(false);
  };

  const handleCreatePlaylist = async () => {
    if (playlistName.length < 1) {
      setErrorMessage('Playlist name cannot be empty');
      return;
    }

    let data = {
      name: playlistName,
      owner: ownerId,
      scope: SCOPES.PRIVATE,
      type: playlistType,
    };
    if (isPublic) {
      data.scope = SCOPES.PUBLIC;
    }
    console.log('creating playlist', data);
    if (playlistType === PLAYLIST_TYPES.GROUP) {
      trackService.createPlaylist(data).then(async response => {
        if (response.status === 201) {
          setIsCreatePlaylistOverlayOpen(false);
          setPlaylistName('');
          setIsPublic(false);
          getPlaylistService();
          Alert.alert('Created!', 'Playlist created successfully');
        } else {
          Alert.alert('Failed!', 'Playlist cannot be created');
        }
      });
    } else {
      const playlistsCollection = database.collections.get('playlists');
      await database.action(async () => {
        try {
          playlistsCollection
            .create(playlist => {
              let uniqueId = getUniqueId();
              // let uniqueIdLength = uniqueId.length;
              let uId = uniqueId.slice(0, 10);
              playlist._raw.id =
                'PLY' +
                uId +
                Math.random()
                  .toFixed(4)
                  .substring(2);
              playlist._raw.name = data.name;
              playlist._raw.owner = data.owner;
              playlist._raw.scope = data.scope;
              playlist._raw.type = data.type;
            })
            .then(async playlist => {
              console.log('Playlsit created successfully');
              setIsCreatePlaylistOverlayOpen(false);
              setPlaylistName('');
              setIsPublic(false);
              getPlaylistService();
            });
        } catch (error) {
          console.error('Playlist cannot be created', error);
        }
      });
      await mySync();
    }
  };

  const handlePlaylistName = value => {
    if (playlistName.length >= 1) {
      setErrorMessage('');
    }
    setPlaylistName(value);
  };

  return (
    <OverlayModal
      visible={isCreatePlaylistOverlayOpen}
      onBackdropPress={handleBackdropPress}>
      <View style={{justifyContent: 'space-evenly', padding: 16}}>
        <InputBox
          errorMessage={errorMessage}
          erro
          value={playlistName}
          onChangeText={handlePlaylistName}
          disabledInputStyle={false}
          style={{padding: 0, margin: 0}}
          type={'text'}
          label={'Playlist Name'}
        />
        <View style={styles.playlistScope}>
          <Text style={{flex: 1, paddingLeft: 10}}>Public playlist</Text>
          <Switch value={isPublic} onValueChange={setIsPublic} />
        </View>
        <Button title={'Create'} onPress={handleCreatePlaylist} />
      </View>
    </OverlayModal>
  );
}

function OverlayMenu(props) {
  const {
    isPlaylistMenuOverlayOpen,
    setIsPlaylistMenuOverlayOpen,
    getPlaylistService,
    playlistId,
  } = props;

  const handleDeletePlaylist = async () => {
    const playlistsCollection = await database.collections.get('playlists');
    const playlistToBeDeleted = await playlistsCollection.find(playlistId);
    await database.action(async () => {
      await playlistToBeDeleted.markAsDeleted();
    });

    // console.log('Add tracksList to playlist');

    const playlistsTracksCollection = await database.collections.get(
      'playlistsTracks',
    );

    const playlistsTracksToBeDeleted = await playlistsTracksCollection
      .query(Q.where('playlistId', playlistId))
      .fetch();
    // console.log('playlistsTracksToBeDeleted', playlistsTracksToBeDeleted);
    playlistsTracksToBeDeleted.forEach(async playlistsTracks => {
      // console.log('playlistsTracks', playlistsTracks);
      const tracksCount = await playlistsTracksCollection
        .query(Q.where('trackId', playlistsTracks._raw.trackId))
        .fetchCount();
      console.log(
        'Tracks to be checked for deletion',
        tracksCount,
        playlistsTracks._raw.trackId,
      );
      if (tracksCount === 1) {
        const tracksCollection = await database.collections.get('tracks');
        let trackRecord = await tracksCollection.find(
          playlistsTracks._raw.trackId,
        );
        await database.action(async () => {
          await playlistsTracks.markAsDeleted();
        });
        if (!trackRecord._raw.isDownloaded) {
          let tracksAlbumCount = await tracksCollection
            .query(Q.where('albumId', trackRecord._raw.albumId))
            .fetchCount();
          if (tracksAlbumCount === 1) {
            const albumsCollection = await database.collections.get('albums');
            let albumRecord = await albumsCollection.find(
              trackRecord._raw.albumId,
            );
            await database.action(async () => {
              await albumRecord.markAsDeleted();
            });
          }
          await database.action(async () => {
            await trackRecord.markAsDeleted();
          });
        }
      }
    });
    setIsPlaylistMenuOverlayOpen(false);
    getPlaylistService();
    await mySync();

    console.log('Playlist deleted');
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
