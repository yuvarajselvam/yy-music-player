import React, {useState} from 'react';
import {View, ScrollView} from 'react-native';
import {ListItem, Image, Text} from 'react-native-elements';
import {Colors} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';

import {Header} from '../../widgets/Header';
import {authService} from '../../services/auth.service';
import {mockPlaylist} from '../../mocks/playlist';

import {commonStyles} from '../common/styles';
import {styles} from './playlist.styles';

export function Playlist(props) {
  const {navigation, route} = props;
  let playlistId = route.params.playlistId;
  console.log(playlistId);
  const [playlist, setPlaylist] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
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
      return () => {
        setPlaylist([]);
      };
    }, [playlistId]),
  );

  return (
    <View style={commonStyles.screenStyle}>
      <Header navigation={navigation} />
      <ScrollView>
        <View style={{alignItems: 'center', padding: 12}}>
          <Image
            source={{uri: mockPlaylist.imageUrl}}
            style={{width: 100, height: 100}}
          />
          <Text h4 style={{color: Colors.grey300, padding: 8}}>
            {mockPlaylist.name}
          </Text>
          <Text style={{color: Colors.grey300}}>Various Artists</Text>
        </View>
        <View style={{flex: 1}}>
          {playlistTracks.map((item, index) => {
            return (
              <ListItem
                containerStyle={styles.listContainer}
                contentContainerStyle={{padding: 10}}
                onPress={() => console.log('Album track selected')}
                key={index}
                title={item.name}
                titleStyle={{color: Colors.grey300}}
                subtitle={'Artists Name'}
                subtitleStyle={{color: Colors.grey300}}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
