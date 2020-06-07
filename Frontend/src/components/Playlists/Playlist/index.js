import React, {useState, useEffect} from 'react';
import {View, ScrollView, Alert, ToastAndroid} from 'react-native';
import {Image, Text, Button, Avatar} from 'react-native-elements';
import {Colors, IconButton, Chip} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';

import {Header} from '../../../widgets/Header';
import {trackService} from '../../../services/track.service';
import {usePlayerContext} from '../../../contexts/player.context';

// import {mockPlaylist} from '../../../mocks/playlist';

import {commonStyles} from '../../common/styles';
import {styles} from './playlist.styles';
import {useAuthContext} from '../../../contexts/auth.context';
import ListItems from '../../../widgets/ListItems';
import {OverlayModal} from '../../../widgets/OverlayModal';
import {userService} from '../../../services/user.service';

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

  const handleSharePlaylist = React.useCallback(() => {
    setIsSharePlaylistOverlayOpen(true);
  }, []);

  return (
    <View style={commonStyles.screenStyle}>
      <Header
        rightIconName="share"
        onRightIconPress={handleSharePlaylist}
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
        <SharePlaylistOverlay
          playlistId={playlistId}
          isSharePlaylistOverlayOpen={isSharePlaylistOverlayOpen}
          setIsSharePlaylistOverlayOpen={setIsSharePlaylistOverlayOpen}
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

function SharePlaylistOverlay(props) {
  const {
    isSharePlaylistOverlayOpen,
    setIsSharePlaylistOverlayOpen,
    playlistId,
  } = props;

  const [followers, setFollowers] = useState([]);
  const [selectedFollowers, setSelectedFollowers] = useState([]);

  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to cancel ?', [
      {
        text: 'No',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          setIsSharePlaylistOverlayOpen(false);
        },
      },
    ]);
  };

  useEffect(() => {
    userService.getFollowers().then(async response => {
      if (response.status === 200) {
        let responseObj = await response.json();
        // console.log('followers list', responseObj);
        let responseFollowersList = responseObj.followers;
        let edittedFollowersList = responseFollowersList.map(value => {
          value.isSelect = false;
          return value;
        });
        setFollowers(edittedFollowersList);
      }
    });
    return () => {
      setFollowers([]);
    };
  }, []);

  const handleSharePlaylist = React.useCallback(() => {
    let data = {
      id: playlistId,
      people: selectedFollowers,
    };
    trackService.sharePlaylist(data).then(response => {
      if (response.status === 200) {
        ToastAndroid.show('Successfully shared!', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Share Unsuccessfull!', ToastAndroid.SHORT);
      }
    });
  }, [playlistId, selectedFollowers]);

  const handleChipClose = React.useCallback(
    follower => {
      if (selectedFollowers.includes(follower)) {
        let filteredFollowers = selectedFollowers.filter(
          selectedFollower => selectedFollower.id !== follower.id,
        );
        setSelectedFollowers(filteredFollowers);
      }
    },
    [selectedFollowers],
  );

  const handleFollowerSelect = React.useCallback(
    follower => {
      if (selectedFollowers.includes(follower)) {
        let filteredSelectedFollowers = selectedFollowers.filter(
          selectedFollower => selectedFollower.id !== follower.id,
        );
        setSelectedFollowers(filteredSelectedFollowers);
      } else {
        setSelectedFollowers(prev => [...prev, follower]);
      }
      if (followers.includes(follower)) {
        follower.isSelect = !follower.isSelect;

        let selectedIndex = followers.indexOf(follower);
        let updatedFollowersList = [...followers];
        updatedFollowersList[selectedIndex] = follower;
        setFollowers(updatedFollowersList);
      }
    },
    [followers, selectedFollowers],
  );

  const selectedItemStyle = {
    backgroundColor: Colors.deepPurpleA700,
    opacity: 0.9,
  };

  return (
    <OverlayModal
      backHandler={backAction}
      visible={isSharePlaylistOverlayOpen}
      fullScreen={true}>
      <View>
        <Header
          title="Share playlist"
          subtitle={
            selectedFollowers.length > 0
              ? selectedFollowers.length + ' followers selected'
              : 'select followers'
          }
          leftIconName="arrow-back"
          onLeftIconPress={() => setIsSharePlaylistOverlayOpen(false)}
          rightIconName="search"
        />
        {selectedFollowers.length > 0 && (
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
            <View style={styles.selectedFollowersContainer}>
              {selectedFollowers.map(follower => {
                return (
                  <Chip
                    style={{margin: 2}}
                    avatar={
                      <Avatar
                        rounded
                        source={{
                          uri:
                            'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                        }}
                        onPress={() => console.log('Works!')}
                        activeOpacity={0.7}
                      />
                    }
                    onClose={() => handleChipClose(follower)}>
                    <Text
                      style={{color: Colors.grey800}}
                      ellipsizeMode="middle">
                      {follower.name}
                    </Text>
                  </Chip>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <ScrollView>
          <ListItems
            options={followers}
            titleKeys={['name']}
            onPress={handleFollowerSelect}
            listSelectedStyle={selectedItemStyle}
            emptyTitle="No Followers"
          />
        </ScrollView>
        <Button title="Share" onPress={handleSharePlaylist} />
      </View>
    </OverlayModal>
  );
}
