import React, {useEffect} from 'react';
import {View} from 'react-native';
import {ActivityIndicator, Colors} from 'react-native-paper';

import {authService} from '../../../services/auth.service';
import {
  MyPlaylistSchema,
  MyPlaylistsSchema,
  PlaylistTrackSchema,
} from '../../schema';

import {styles} from './load.styles';

const Realm = require('realm');

export function Load(props) {
  const {setIsLoaded} = props;

  useEffect(() => {
    // if (
    //   Realm.exists({
    //     schema: [MyPlaylistSchema, MyPlaylistsSchema, PlaylistTrackSchema],
    //   })
    // ) {
    //   console.log('Realm DB already exists!');
    //   setIsLoaded(true);
    // } else {
    authService.getMyPlaylists().then(async response => {
      if (response.status === 200) {
        let responseData = await response.json();
        // console.log('Playlists === ', responseData[1].tracks);
        Realm.open({
          schema: [MyPlaylistSchema, MyPlaylistsSchema, PlaylistTrackSchema],
        }).then(realm => {
          try {
            realm.write(() => {
              realm.create('MyPlaylists', {
                myPlaylists: responseData,
              });
            });
          } catch (e) {
            console.log();
            console.log('Error on creation');
          }
          console.log('MyPlaylists Realm === ', realm.objects('MyPlaylists'));
          realm.close();
        });
      } else if (response.status === 204) {
      }
    });
    // }
    setIsLoaded(true);
    console.log(Realm.Results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={styles.indicator}>
      <ActivityIndicator
        animating={true}
        size={'large'}
        color={Colors.red800}
      />
    </View>
  );
}
