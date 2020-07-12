import React, {useState} from 'react';
import {View, ScrollView} from 'react-native';
import {Image, Text, Icon} from 'react-native-elements';
import {Colors} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';

import {Header} from '../../shared/widgets/Header';
import {trackService} from '../../services/track.service';
import {usePlayerContext} from '../../contexts/player.context';

// import {mockAlbum} from '../../mocks/album';

import {commonStyles} from '../common/styles';
import {styles} from './album.style';
import ListItems from '../../shared/components/ListItems';
import {OverlayMenu, PlaylistsOverlay} from '../Search';

export function Album(props) {
  const {navigation, route} = props;
  let albumId = route.params.id;
  let albumlanguage = route.params.language;
  console.log('Album screen', albumlanguage);

  const [album, setAlbum] = useState({artists: [{name: ''}]});
  const [albumTracks, setAlbumTracks] = useState([]);
  const [isTrackOverlayOpen, setIsTrackOverlayOpen] = useState(false);
  const [isPlaylistsOverlayOpen, setIsPlaylistsOverlayOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState([]);

  const {onAddTrack, onPlay} = usePlayerContext();

  useFocusEffect(
    React.useCallback(() => {
      let data = {
        id: albumId,
        language: albumlanguage,
      };
      trackService.getAlbum(data).then(async response => {
        if (response.status === 200) {
          let responseData = await response.json();
          // console.log('Album ===', responseData.artists);
          setAlbum(responseData);
          setAlbumTracks(responseData.tracks);
        }
      });
      return () => {};
    }, [albumId, albumlanguage]),
  );

  const handleTrackSelect = React.useCallback(
    track => {
      let data = {
        id: track.id,
        language: albumlanguage,
      };
      if (!track.trackUrl) {
        trackService.getTrack(data).then(async response => {
          if (response.status === 200) {
            let responseObj = await response.json();
            onAddTrack(responseObj).then(() => {
              onPlay();
            });
          }
        });
      } else {
        onAddTrack(track).then(() => {
          onPlay();
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [albumlanguage],
  );

  const handleTrackMenuOverlay = track => {
    console.log(track);
    track.album = album;
    setSelectedTrack([track]);
    setIsTrackOverlayOpen(true);
  };

  const handlePlaylistTrackEdit = type => {
    setIsTrackOverlayOpen(false);
    setIsPlaylistsOverlayOpen(true);
  };

  return (
    <View style={commonStyles.screenStyle}>
      <Header navigation={navigation} />
      <ScrollView overScrollMode="never">
        <View style={{alignItems: 'center', padding: 12}}>
          <Image source={{uri: album.imageUrl}} style={styles.albumImage} />
          <Text h4 style={{color: Colors.grey200}}>
            {album.name}
          </Text>
          <Text style={{color: Colors.grey200}}>{album.artists[0].name}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: Colors.grey200}}>{album.releaseYear} | </Text>
            <Text style={{color: Colors.grey200}}>{album.totalTracks}</Text>
          </View>
          <Icon
            raised
            reverse
            name="play"
            type="material-community"
            color={Colors.grey500}
            onPress={() => console.log('hello')}
          />
        </View>
        <View style={{flex: 1}}>
          <ListItems
            options={albumTracks}
            titleKeys={['name']}
            subtitleKeys={['artists']}
            onPress={handleTrackSelect}
            rightIconName="more-vert"
            onRightIconPress={handleTrackMenuOverlay}
          />
        </View>
      </ScrollView>
      {isTrackOverlayOpen && (
        <OverlayMenu
          isOVerlayVisible={isTrackOverlayOpen}
          setIsOverlayVisible={setIsTrackOverlayOpen}
          selectedTrackItems={selectedTrack}
          handlePlaylistTrackEdit={handlePlaylistTrackEdit}
        />
      )}
      {isPlaylistsOverlayOpen && (
        <PlaylistsOverlay
          isPlaylistsOverlayOpen={isPlaylistsOverlayOpen}
          setIsPlaylistsOverlayOpen={setIsPlaylistsOverlayOpen}
          selectedItems={selectedTrack}
          handleRemoveSelectedItems={() => {}}
          setIsSelectable={() => {}}
        />
      )}
    </View>
  );
}
