import React, {useState, useCallback} from 'react';
import {View, ScrollView, ToastAndroid} from 'react-native';
import {Text, Button} from 'react-native-elements';
import {IconButton, Colors} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {Q} from '@nozbe/watermelondb';

import {usePlayerContext} from '../../contexts/player.context';

import {Header} from '../../shared/widgets/Header';
import ListItems from '../../shared/components/ListItems';
import {database} from '../../utils/db/model';

import {commonStyles} from '../common/styles';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {OverlayModal} from '../../shared/components/OverlayModal';

import {styles} from './mymusic.styles';
import {removeDownloadedTrack} from '../../shared/utils/Downloads';

export function MyMusic({navigation}) {
  const [downloadedTracks, setDownloadedTracks] = useState([]);
  const [isTrackMenuOverlayOpen, setIsTrackMenuOverlayOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState({});

  const {onAddTrack, onPlay} = usePlayerContext();

  useFocusEffect(
    React.useCallback(() => {
      getDownloadedTracks();
    }, [getDownloadedTracks]),
  );

  const getDownloadedTracks = useCallback(() => {
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
      .then(async record => {
        console.log('downloadedTracksRecord ', record);
        let downloadedTrackList = await Promise.all(
          record.map(async track => {
            let albumObj = await database.collections
              .get('albums')
              .find(track._raw.albumId);
            let data = {
              id: track._raw.id,
              name: track._raw.name,
              imageUrl: track._raw.imageUrl,
              artists: track._raw.artists,
              trackUrl: track._raw.path,
              album: {
                id: albumObj._raw.id,
                name: albumObj._raw.name,
                artists: albumObj._raw.artists,
              },
            };
            return data;
          }),
        );
        setDownloadedTracks(downloadedTrackList);
      });
  }, []);

  const handlePlay = trackObj => {
    onAddTrack(trackObj).then(() => {
      onPlay();
    });
  };

  const handleTrackOptions = track => {
    setSelectedTrack(track);
    setIsTrackMenuOverlayOpen(true);
  };

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
          emptyTitle="No downloads"
        />
        {isTrackMenuOverlayOpen && (
          <TrackMenuOverlay
            isTrackMenuOverlayOpen={isTrackMenuOverlayOpen}
            setIsTrackMenuOverlayOpen={setIsTrackMenuOverlayOpen}
            trackObj={selectedTrack}
            getDownloadedTracks={getDownloadedTracks}
          />
        )}
      </ScrollView>
    </View>
  );
}

function TrackMenuOverlay(props) {
  const {
    isTrackMenuOverlayOpen,
    setIsTrackMenuOverlayOpen,
    trackObj,
    getDownloadedTracks,
  } = props;

  const {trackDetails, onReset} = usePlayerContext();

  const handleRemoveTrackfromDownloads = () => {
    removeDownloadedTrack(trackObj)
      .then(async () => {
        ToastAndroid.show(
          'Track removed from downloads successfully',
          ToastAndroid.SHORT,
        );
        setIsTrackMenuOverlayOpen(false);
        getDownloadedTracks();

        if (trackDetails.id === trackObj.id) {
          await onReset();
        }
      })
      .catch(err => {
        console.log(err);
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
          title="Remove track from downloads"
          titleStyle={styles.overlayButtonTitle}
          onPress={handleRemoveTrackfromDownloads}
        />
        <Button
          icon={<IconButton color={Colors.grey200} icon="playlist-edit" />}
          buttonStyle={styles.overlayButtons}
          type="clear"
          title="Add track to playlist"
          titleStyle={styles.overlayButtonTitle}
        />
      </View>
    </OverlayModal>
  );
}
