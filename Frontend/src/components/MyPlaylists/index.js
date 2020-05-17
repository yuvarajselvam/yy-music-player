import React, {useState, useEffect} from 'react';
import {View, Alert, InteractionManager} from 'react-native';
import {Card, ListItem, Button, Overlay, Text} from 'react-native-elements';
import {Colors, Switch, IconButton} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {heightPercentageToDP} from 'react-native-responsive-screen';

import {Header} from '../../widgets/Header';
import {InputBox} from '../../widgets/InputBox';
import {trackService} from '../../services/track.service';
import {OverlayModal} from '../../widgets/OverlayModal';
// import {mockMyPlaylists} from '../../mocks/my.playlists';

import {commonStyles} from '../common/styles';
import {styles} from './myplaylists.styles';
import {useAuthContext} from '../../contexts/auth.context';

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
        setPlaylists(responseData);
      } else if (response.status === 204) {
        setPlaylists([]);
      }
    });
  };

  const createPlaylist = () => {
    console.log('Creating playlist');
    setIsCreatePlaylistOverlayOpen(true);
  };

  const handlePlaylistSelect = playlist => {
    console.log(playlist);
    navigation.navigate('Playlist', {playlistId: playlist._id});
  };

  const handleVerticalDotButton = id => {
    setIsPlaylistMenuOverlayOpen(true);
    setPlaylistId(id);
  };

  return (
    <View style={commonStyles.screenStyle}>
      <Header navigation={navigation} title="My Playlists" />
      <Card containerStyle={styles.card}>
        {playlists.map((playlist, index) => {
          return (
            <ListItem
              title={playlist.name}
              containerStyle={styles.listContainer}
              rightElement={
                <IconButton
                  style={{alignItems: 'flex-end', margin: 0}}
                  color={Colors.grey200}
                  size={heightPercentageToDP(2.8)}
                  icon="dots-vertical"
                  onPress={() => handleVerticalDotButton(playlist._id)}
                />
              }
              key={index}
              onPress={() => handlePlaylistSelect(playlist)}
            />
          );
        })}
        <View style={{alignItems: 'center', padding: 12}}>
          <Button title="Create Playlist" onPress={createPlaylist} />
        </View>
      </Card>
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
    console.log('creating playlist', userInfo);
    let data = {
      name: playlistName,
      type: 'playlist',
      owner: userInfo._id,
    };
    if (isPublic) {
      data.scope = 'public';
    }
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
      _id: playlistId,
      owner: userInfo._id,
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
