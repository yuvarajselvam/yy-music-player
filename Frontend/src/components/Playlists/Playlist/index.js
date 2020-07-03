import React, {useState, useEffect} from 'react';
import {View, ScrollView, Alert, ToastAndroid} from 'react-native';
import {Image, Text, Button} from 'react-native-elements';
import {Colors, IconButton} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {Q} from '@nozbe/watermelondb';

import {usePlayerContext} from '../../../contexts/player.context';
import {useAuthContext} from '../../../contexts/auth.context';

import {Header} from '../../../shared/widgets/Header';
import ListItems from '../../../shared/components/ListItems';
import {OverlayModal} from '../../../shared/components/OverlayModal';
import {UserModal} from '../../../shared/components/UserModal';

import {trackService} from '../../../services/track.service';
import {userService} from '../../../services/user.service';
import {database} from '../../../utils/db/model';
import {downloadTracks} from '../../../shared/utils/Downloads';
import {playlistsTracksSubject, mySync} from '../../../utils/db/model/sync';

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

  useFocusEffect(
    React.useCallback(() => {
      getPlaylist();
      return () => {
        setPlaylist({});
        setPlaylistTracks();
      };
    }, [getPlaylist]),
  );

  useEffect(() => {
    let playlistsTracksSubscriber = playlistsTracksSubject.subscribe(value => {
      console.log('Playlist subscriber');
      getPlaylist();
    });

    return () => playlistsTracksSubscriber.unsubscribe();
  }, [getPlaylist]);

  const getPlaylist = React.useCallback(() => {
    console.log('get playlists calling!!');
    const playlistsCollection = database.collections.get('playlists');
    playlistsCollection.find(playlistId).then(async playlistRecord => {
      console.log('Playlist record', playlist);
      let playlistObj = {
        id: playlistRecord._raw.id,
        name: playlistRecord._raw.name,
        owner: playlistRecord._raw.owner,
        scope: playlistRecord._raw.scope,
        type: playlistRecord._raw.type,
      };
      console.log(
        'Playlist record tracks',
        await playlistRecord.tracks.fetch(),
      );
      playlistRecord.tracks.fetch().then(trackRecords => {
        let trackList = trackRecords.map(tracks => {
          let data = {
            id: tracks._raw.id,
            name: tracks._raw.name,
            imageUrl: tracks._raw.imageUrl,
            artists: tracks._raw.artists,
          };
          return data;
        });
        setPlaylist(playlistObj);
        setPlaylistTracks(trackList);
      });
    });
  }, [playlist, playlistId]);

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
          getPlaylist={getPlaylist}
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
    getPlaylist,
    playlist,
  } = props;

  const {userInfo} = useAuthContext();

  const handleRemoveFromPlaylist = async () => {
    let playlistObj = {
      id: playlist.id,
      tracks: [trackObj],
      userId: userInfo.id,
    };

    try {
      const tracksCollection = await database.collections.get('tracks');

      const playlistsTracksCollection = await database.collections.get(
        'playlistsTracks',
      );

      playlistObj.tracks.forEach(async track => {
        let trackRecord = await tracksCollection.find(track.id);
        let playlistsTrackCount = await playlistsTracksCollection
          .query(Q.where('trackId', track.id))
          .fetchCount();
        if (playlistsTrackCount === 1) {
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
      // console.log('Add tracksList to playlist');

      playlistObj.tracks.forEach(async track => {
        let playlistsTrackRecord = await playlistsTracksCollection.find(
          playlistObj.id + '__' + track.id,
        );
        await database.action(async () => {
          await playlistsTrackRecord.markAsDeleted();
        });
      });
      console.log('Add tracksIdList to playlist');

      Alert.alert('Success!', 'Tracks removed from playlist successfully');
      setIsTrackMenuOverlayOpen(false);
      getPlaylist();
      await mySync();
    } catch (error) {
      console.log(error);
      Alert.alert('Failed!', 'Tracks cannot be removed from Playlist');
    }
  };

  const handleTrackDownload = () => {
    console.log('Download', trackObj.language);
    let data = {
      id: trackObj.id,
      language: 'Tamil',
    };
    downloadTracks(data).then(() => {
      setIsTrackMenuOverlayOpen(false);
      ToastAndroid.show('Song downloaded successfully!', ToastAndroid.SHORT);
    });
  };

  return (
    <OverlayModal
      position="bottom"
      visible={isTrackMenuOverlayOpen}
      onBackdropPress={() => setIsTrackMenuOverlayOpen(false)}>
      <View>
        <Button
          icon={<IconButton color={Colors.grey200} icon="download" />}
          buttonStyle={styles.overlayButtons}
          type="clear"
          title="Download track"
          titleStyle={styles.overlayButtonTitle}
          onPress={handleTrackDownload}
        />
        <Button
          icon={<IconButton color={Colors.grey200} icon="playlist-remove" />}
          buttonStyle={styles.overlayButtons}
          type="clear"
          title="Remove track from playlist"
          titleStyle={styles.overlayButtonTitle}
          onPress={handleRemoveFromPlaylist}
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
