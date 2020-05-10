import React, {useState, useContext} from 'react';
import {View, ScrollView, Alert} from 'react-native';
import {ListItem, Image, Text, Overlay, Button} from 'react-native-elements';
import {Colors, IconButton} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

import {Header} from '../../widgets/Header';
import {authService} from '../../services/auth.service';
import {PlayerContext} from '../../contexts/player.context';

// import {mockPlaylist} from '../../mocks/playlist';

import {commonStyles} from '../common/styles';
import {styles} from './playlist.styles';

export function Playlist(props) {
  console.log('Playlist screen');
  const {navigation, route} = props;
  let playlistId = route.params.playlistId;
  const [playlist, setPlaylist] = useState([]);
  const [trackId, setTrackId] = useState('');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isTrackMenuOverlayOpen, setIsTrackMenuOverlayOpen] = useState(false);

  const {onAddTrack, onPlay} = useContext(PlayerContext);

  const getPlaylistService = () => {
    let data = {
      _id: playlistId,
    };
    authService.getPlaylist(data).then(async response => {
      if (response.status === 200) {
        let responseData = await response.json();
        console.log('Playlist ===', responseData);
        setPlaylist(responseData);
        setPlaylistTracks(responseData.tracks);
      }
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      getPlaylistService();
      return () => {};
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playlistId]),
  );

  const handleTrackSelect = track => {
    console.log(track);
    let data = {
      _id: track.id,
      language: 'Tamil',
    };
    authService.getTrack(data).then(async response => {
      let trackObj = await response.json();
      onAddTrack(trackObj).then(() => {
        onPlay();
      });
    });
  };

  const handleTrackMenu = track => {
    setIsTrackMenuOverlayOpen(true);
    setTrackId(track);
  };

  return (
    <View style={commonStyles.screenStyle}>
      <Header navigation={navigation} title={playlist.name} />
      <ScrollView>
        <View style={{alignItems: 'center', padding: 12}}>
          <Image
            source={{uri: playlist.imageUrl}}
            style={{width: 100, height: 100}}
          />
          <Text h4 style={{color: Colors.grey200, padding: 8}}>
            {playlist.name}
          </Text>
          <Text style={{color: Colors.grey200}}>Various Artists</Text>
        </View>
        <View style={{flex: 1}}>
          {playlistTracks.map((track, index) => {
            return (
              <ListItem
                containerStyle={styles.listContainer}
                contentContainerStyle={{padding: 10}}
                onPress={() => handleTrackSelect(track)}
                key={index}
                title={track.name}
                // titleStyle={{color: Colors.grey200}}
                subtitle={track.artists}
                subtitleStyle={{color: Colors.grey200}}
                rightElement={
                  <IconButton
                    style={styles.listVerticalButton}
                    color={Colors.grey200}
                    size={heightPercentageToDP(2.8)}
                    icon="dots-vertical"
                    onPress={() => handleTrackMenu(track)}
                  />
                }
              />
            );
          })}
        </View>
      </ScrollView>
      <TrackOverlayMenu
        setIsTrackMenuOverlayOpen={setIsTrackMenuOverlayOpen}
        isTrackMenuOverlayOpen={isTrackMenuOverlayOpen}
        trackObj={trackId}
        playlistId={playlistId}
        getPlaylistService={getPlaylistService}
      />
    </View>
  );
}

function TrackOverlayMenu(props) {
  const {
    isTrackMenuOverlayOpen,
    setIsTrackMenuOverlayOpen,
    trackObj,
    playlistId,
    getPlaylistService,
  } = props;

  const handleEditPlaylist = () => {
    let track = {
      _id: playlistId,
      tracks: [trackObj],
      owner: '5e7baa1a88a82254f4f8daed',
    };

    setIsTrackMenuOverlayOpen(false);
    authService.removeFromPlaylist(track).then(response => {
      if (response.status === 200) {
        Alert.alert('Success!', 'Track deleted successfully');
        getPlaylistService();
      } else {
        Alert.alert('Failed!', 'Track cannot be deleted');
      }
    });
  };

  return (
    <Overlay
      height={heightPercentageToDP('20%')}
      width={widthPercentageToDP('100%')}
      containerStyle={styles.overlayContainer}
      transparent={true}
      overlayStyle={styles.overlay}
      animationType="fade"
      overlayBackgroundColor={Colors.grey900}
      isVisible={isTrackMenuOverlayOpen}
      onBackdropPress={() => setIsTrackMenuOverlayOpen(false)}>
      <View style={styles.overlayContent}>
        <Button
          icon={<IconButton color={Colors.grey200} icon="playlist-remove" />}
          buttonStyle={styles.overlayButtons}
          type="clear"
          title="Delete Playlist"
          titleStyle={styles.overlayButtonTitle}
          onPress={handleEditPlaylist}
        />
        <Button
          icon={<IconButton color={Colors.grey200} icon="playlist-edit" />}
          buttonStyle={styles.overlayButtons}
          type="clear"
          title="Change Playlist Name"
          titleStyle={styles.overlayButtonTitle}
        />
      </View>
    </Overlay>
  );
}
