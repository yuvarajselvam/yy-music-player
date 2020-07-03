import React, {useState} from 'react';
import {View, ScrollView, Alert, ToastAndroid} from 'react-native';
import {Image, Text, Button} from 'react-native-elements';
import {Colors, IconButton} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';

import {usePlayerContext} from '../../../contexts/player.context';
import {useAuthContext} from '../../../contexts/auth.context';

import {Header} from '../../../shared/widgets/Header';
import ListItems from '../../../shared/components/ListItems';
import {OverlayModal} from '../../../shared/components/OverlayModal';
import {UserModal} from '../../../shared/components/UserModal';

import {trackService} from '../../../services/track.service';
import {userService} from '../../../services/user.service';

// import {mockPlaylist} from '../../../mocks/playlist';

import {commonStyles} from '../../common/styles';
import {styles} from './playlist.styles';

export function Playlist(props) {
  console.log('Playlist screen');
  const {navigation, route} = props;
  const playlistId = route.params.playlistId;
  const [track, setTrack] = useState('');
  const [playlist, setPlaylist] = useState({});
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isTrackMenuOverlayOpen, setIsTrackMenuOverlayOpen] = useState(false);
  const [isSharePlaylistOverlayOpen, setIsSharePlaylistOverlayOpen] = useState(
    false,
  );

  const {onAddTrack, onPlay} = usePlayerContext();

  const getPlaylistService = () => {
    let data = {
      id: playlistId,
    };
    trackService.getPlaylist(data).then(async response => {
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

  const handleTrackSelect = React.useCallback(trackObj => {
    // console.log(trackObj);
    let data = {
      id: trackObj.id,
      language: 'Tamil',
    };
    trackService.getTrack(data).then(async response => {
      let responseObj = await response.json();
      onAddTrack(responseObj).then(() => {
        onPlay();
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTrackMenu = React.useCallback(trackObj => {
    setIsTrackMenuOverlayOpen(true);
    setTrack(trackObj);
  }, []);

  const handleSharePlaylistOverlay = React.useCallback(() => {
    setIsSharePlaylistOverlayOpen(true);
  }, []);

  const handleSharePlaylist = React.useCallback(
    selectedFollowers => {
      let data = {
        id: playlistId,
        people: selectedFollowers,
      };
      trackService.sharePlaylist(data).then(response => {
        setIsSharePlaylistOverlayOpen(false);
        if (response.status === 200) {
          ToastAndroid.show('Successfully shared!', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Share Unsuccessfull!', ToastAndroid.SHORT);
        }
      });
    },
    [playlistId],
  );

  return (
    <View style={commonStyles.screenStyle}>
      <Header
        rightIconName="share"
        onRightIconPress={handleSharePlaylistOverlay}
        navigation={navigation}
        title={playlist.name}
      />
      <ScrollView>
        <View style={{alignItems: 'center', padding: 12}}>
          <Image
            // source={{uri: playlist.imageUrl}}
            style={{width: 100, height: 100}}
          />
          <Text h4 style={{color: Colors.grey200, padding: 8}}>
            {playlist.name}
          </Text>
          <Text style={{color: Colors.grey200}}>Various Artists</Text>
        </View>
        <ListItems
          options={playlistTracks}
          titleKeys={['name']}
          subtitleKeys={['artists']}
          rightIconName="more-vert"
          onRightIconPress={handleTrackMenu}
          onPress={handleTrackSelect}
        />
      </ScrollView>
      {isTrackMenuOverlayOpen && (
        <TrackOverlayMenu
          setIsTrackMenuOverlayOpen={setIsTrackMenuOverlayOpen}
          isTrackMenuOverlayOpen={isTrackMenuOverlayOpen}
          trackObj={track}
          getPlaylistService={getPlaylistService}
          playlist={playlist}
        />
      )}
      {isSharePlaylistOverlayOpen && (
        <UserModal
          onDone={handleSharePlaylist}
          isSOpen={isSharePlaylistOverlayOpen}
          setIsOpen={setIsSharePlaylistOverlayOpen}
          dataSource={userService.getFollowers}
          type="followers"
        />
      )}
    </View>
  );
}

function TrackOverlayMenu(props) {
  const {
    isTrackMenuOverlayOpen,
    setIsTrackMenuOverlayOpen,
    trackObj,
    getPlaylistService,
    playlist,
  } = props;

  const {userInfo} = useAuthContext();

  const handleEditPlaylist = () => {
    let track = {
      id: playlist.id,
      tracks: [trackObj],
      userId: userInfo.id,
    };

    setIsTrackMenuOverlayOpen(false);
    trackService.removeFromPlaylist(track).then(response => {
      if (response.status === 200) {
        Alert.alert('Success!', 'Track deleted successfully');
        getPlaylistService();
      } else {
        Alert.alert('Failed!', 'Track cannot be deleted');
      }
    });
  };

  return (
    <OverlayModal
      position="bottom"
      visible={isTrackMenuOverlayOpen}
      onBackdropPress={() => setIsTrackMenuOverlayOpen(false)}>
      <View>
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
    </OverlayModal>
  );
}
