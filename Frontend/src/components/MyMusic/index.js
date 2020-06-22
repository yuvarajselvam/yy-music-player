import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Text, Input, Button} from 'react-native-elements';
import RNFetchBlob from 'rn-fetch-blob';

import {usePlayerContext} from '../../contexts/player.context';

import {Header} from '../../shared/widgets/Header';
import {commonStyles} from '../common/styles';
import ListItems from '../../shared/components/ListItems';
import {trackService} from '../../services/track.service';

export function MyMusic({navigation}) {
  const [downloadedTracks, setDownloadedTracks] = useState([]);
  const {onAddTrack, onPlay} = usePlayerContext();

  useEffect(() => {
    let dirs = RNFetchBlob.fs.dirs;
    // RNFetchBlob.fs
    //   .stat(dirs.DocumentDir + '/songs/')
    //   .then(stats => {
    //     console.log(stats);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
    // RNFetchBlob.fs.ls(dirs.DocumentDir + '/songs').then(files => {
    //   console.log(files);
    // });

    trackService.downloads().then(async response => {
      if (response.status == 200) {
        let responseData = await response.json();
        console.log(responseData.downloadedTracks);
        setDownloadedTracks(responseData.downloadedTracks);
      } else {
        console.error('Cannot get the downloaded songs');
      }
    });
  }, []);

  const handlePlay = track => {
    let dirs = RNFetchBlob.fs.dirs;
    let trackUrl = `file:///${dirs.DocumentDir}/songs/${track.id}.mp3`;
    let trackObj = {
      id: track.id,
      name: track.name,
      artists: track.artists,
      album: track.album,
      imageUrl: track.imageUrl,
      trackUrl: trackUrl,
    };
    onAddTrack(trackObj).then(() => {
      onPlay();
    });
  };

  return (
    <View style={commonStyles.screenStyle}>
      <Header navigation={navigation} title="My Music" />
      <Text>Downloads</Text>
      <ListItems
        options={downloadedTracks}
        titleKeys={['name']}
        subtitleKeys={['artists']}
        onPress={handlePlay}
      />
    </View>
  );
}
