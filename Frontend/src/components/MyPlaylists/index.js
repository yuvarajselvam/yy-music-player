import React, {useState} from 'react';
import {View, Alert, InteractionManager, ScrollView} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {Colors, Switch, IconButton} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';

import {Header} from '../../widgets/Header';
import {InputBox} from '../../widgets/InputBox';
import {trackService} from '../../services/track.service';
import {OverlayModal} from '../../widgets/OverlayModal';
// import {mockMyPlaylists} from '../../mocks/my.playlists';

import {commonStyles} from '../common/styles';
import {styles} from './myplaylists.styles';
import {useAuthContext} from '../../contexts/auth.context';
import ListItems from '../../widgets/ListItems';

const SCOPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

export function MyPlaylists({navigation}) {
  const [
    isCreatePlaylistOverlayOpen,
    setIsCreatePlaylistOverlayOpen,
  ] = useState(false);
  const [isPlaylistMenuOverlayOpen, setIsPlaylistMenuOverlayOpen] = useState(
    false,
  );
  const [playlistName, setPlaylistName] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      getPlaylistService();
      return () => {};
    }, []),
  );

  const getPlaylistService = () => {
    trackService.getMyPlaylists().then(async response => {
      if (response.status === 200) {
        let responseData = await response.json();
        // console.log('Playlists ===', responseData);
        setPlaylists(responseData.playlists);
      } else if (response.status === 204) {
        setPlaylists([]);
      }
    });
  };

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
      <Header navigation={navigation} title="My Playlists" />
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
        playlistName={playlistName}
        setPlaylistName={setPlaylistName}
        getPlaylistService={getPlaylistService}
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

function CreatePlaylistOverlay(props) {
  const {
    isCreatePlaylistOverlayOpen,
    setIsCreatePlaylistOverlayOpen,
    playlistName,
    setPlaylistName,
    getPlaylistService,
  } = props;

  const [isPublic, setIsPublic] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {userInfo} = useAuthContext();

  const handleBackdropPress = () => {
    setIsCreatePlaylistOverlayOpen(false);
    setPlaylistName('');
    setIsPublic(false);
  };

  const handleCreatePlaylist = () => {
    if (playlistName.length < 1) {
      setErrorMessage('Playlist name cannot be empty');
      return;
    }
    let data = {
      name: playlistName,
      owner: userInfo.id,
      scope: SCOPES.PRIVATE,
    };
    if (isPublic) {
      data.scope = SCOPES.PUBLIC;
    }
    // console.log('creating playlist', data);
    trackService.createPlaylist(data).then(response => {
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

  const {userInfo} = useAuthContext();

  const handleDeletePlaylist = () => {
    let playlist = {
      id: playlistId,
      userId: userInfo.id,
    };

    setIsPlaylistMenuOverlayOpen(false);
    trackService.deletePlaylist(playlist).then(response => {
      if (response.status === 200) {
        getPlaylistService();
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
