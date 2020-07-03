import React, {useState} from 'react';
import {View, ScrollView} from 'react-native';
import {Text} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import {Q} from '@nozbe/watermelondb';

import {usePlayerContext} from '../../contexts/player.context';

import {Header} from '../../shared/widgets/Header';
import ListItems from '../../shared/components/ListItems';
import {database} from '../../utils/db/model';
import {trackService} from '../../services/track.service';

import {commonStyles} from '../common/styles';
import {widthPercentageToDP} from 'react-native-responsive-screen';

export function MyMusic({navigation}) {
  const [downloadedTracks, setDownloadedTracks] = useState([]);
  const {onAddTrack, onPlay} = usePlayerContext();

  useFocusEffect(
    React.useCallback(() => {
      database.collections
        .get('albums')
        .query()
        .fetch()
        .then(records => {
          console.log('Albums list ', records);
        });
      let tracksCollection = database.collections.get('tracks');
      tracksCollection
        .query(Q.where('isDownloaded', true))
        .fetch()
        .then(record => {
          console.log('downloadedTracksRecord ', record);
          let downloadedTrackList = record.map(tracks => {
            let data = {
              id: tracks._raw.id,
              name: tracks._raw.name,
              imageUrl: tracks._raw.imageUrl,
              artists: tracks._raw.artists,
              trackUrl: tracks._raw.path,
              album: {},
            };
            return data;
          });
          setDownloadedTracks(downloadedTrackList);
        });
    }, []),
  );

  const handlePlay = trackObj => {
    onAddTrack(trackObj).then(() => {
      onPlay();
    });
  };

  const handleTrackOptions = () => {};

  return (
    <View style={commonStyles.screenStyle}>
      <Header navigation={navigation} title="My Music" />
      <View style={{flexDirection: 'row', padding: 10}}>
        <Text style={{fontSize: widthPercentageToDP(4.8)}}>Downloads</Text>
      </View>
      <ScrollView>
        <ListItems
          options={downloadedTracks}
          titleKeys={['name']}
          subtitleKeys={['artists']}
          onPress={handlePlay}
          rightIconName="more-vert"
          onRightIconPress={handleTrackOptions}
        />
      </ScrollView>
    </View>
  );
}
