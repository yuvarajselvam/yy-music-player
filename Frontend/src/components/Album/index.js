import React, {useState, useContext} from 'react';
import {View, ScrollView} from 'react-native';
import {Image, Text, ListItem, Icon} from 'react-native-elements';
import {Colors, IconButton} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {heightPercentageToDP} from 'react-native-responsive-screen';

import {Header} from '../../widgets/Header';
import {authService} from '../../services/auth.service';
import {PlayerContext} from '../../contexts/player.context';

// import {mockAlbum} from '../../mocks/album';

import {commonStyles} from '../common/styles';
import {styles} from './album.style';

export function Album(props) {
  const {navigation, route} = props;
  let albumId = route.params._id;
  console.log('Album screen');
  let albumlanguage = route.params.language;
  const [album, setAlbum] = useState({artists: [{name: ''}]});
  const [albumTracks, setAlbumTracks] = useState([]);

  const {onAddTrack, onPlay, onReset} = useContext(PlayerContext);

  useFocusEffect(
    React.useCallback(() => {
      let data = {
        _id: albumId,
        language: albumlanguage,
      };
      authService.getAlbum(data).then(async response => {
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

  const handleTrackSelect = track => {
    console.log(album.artists[0].name);
    let data = {
      _id: track._id,
      language: album.language,
    };
    // console.log(data);
    let trackObj = track;
    if (!track.trackUrl) {
      authService.getTrack(data).then(async response => {
        if (response.status === 200) {
          let responseObj = await response.json();
          trackObj = responseObj;
        }
      });
    }
    onAddTrack(trackObj).then(() => {
      onPlay();
    });
  };

  return (
    <View style={commonStyles.screenStyle}>
      <Header navigation={navigation} />
      <ScrollView>
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
        <View style={{flex: 1, paddingBottom: 24}}>
          {albumTracks.map((track, index) => {
            let artistsName = track.artists.map(artist => {
              return artist.name;
            });
            let trackArtistsName = artistsName.join(', ');
            return (
              <ListItem
                containerStyle={{
                  padding: 0,
                  paddingLeft: 12,
                  paddingRight: 4,
                  backgroundColor: Colors.grey900,
                  borderBottomWidth: 0,
                }}
                contentContainerStyle={{padding: 10}}
                // leftElement={
                //   <View style={{paddingLeft: 10, alignItems: 'center'}}>
                //     <Text style={{color: Colors.grey200}}>{trackNumber}</Text>
                //   </View>
                // }
                rightElement={
                  <IconButton
                    style={styles.listVerticalButton}
                    color={Colors.grey200}
                    size={heightPercentageToDP(2.8)}
                    icon="dots-vertical"
                  />
                }
                key={track._id}
                title={track.name}
                titleStyle={{color: Colors.grey200, paddingBottom: 4}}
                subtitle={trackArtistsName}
                subtitleStyle={{
                  color: Colors.grey200,
                  fontStyle: 'italic',
                  fontSize: 14,
                }}
                onPress={() => handleTrackSelect(track)}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
