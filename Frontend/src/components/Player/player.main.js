import React, {useEffect, useContext} from 'react';
import {View} from 'react-native';
import {Slider} from 'react-native-elements';
import {IconButton} from 'react-native-paper';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {PlayerContext} from '../../contexts/player.context';

import {styles} from './player.styles';

export function PlayerMain({trackObj}) {
  const [
    onAddTrack,
    onSetupPlayer,
    onUpdateOptions,
    onPlay,
    onPause,
    onPrevious,
    onNext,
    onReset,
    onRemove,
    onDestroy,
    bufferedPosition,
    duration,
    position,
    playbackState,
    isPlaying,
    setIsPlaying,
  ] = useContext(PlayerContext);

  useEffect(() => {
    console.log('UseEffect ADD_TRACK', trackObj.songUrl);
    onAddTrack(trackObj.id, trackObj.songUrl).then(() => {
      if (trackObj.songUrl.length > 0 && playbackState !== 0) {
        onReset();
        console.log('Autoplaying initialising');
        onPlay();
        setIsPlaying(true);
      }
    });
  }, [trackObj.songUrl]);

  useEffect(() => {
    console.log('UseEffect PLAYER');
    onSetupPlayer();
    onUpdateOptions();
    return () => onDestroy();
  }, []);

  return (
    <View style={styles.miniPlayer}>
      <View style={styles.trackBar}>
        <Slider
          style={styles.seekBar}
          value={position}
          minimumValue={0}
          maximumValue={duration}
          thumbStyle={{display: 'none'}}
          trackStyle={styles.seekBarTrack}
          minimumTrackTintColor="#6a0080"
          maximumTrackTintColor="#d05ce3"
        />
        <View style={styles.miniPlayerControls}>
          <IconButton
            style={styles.playerButtons}
            size={wp(12)}
            icon="skip-previous"
            color={'#E0E0E0'}
            onPress={onPrevious}
          />
          {!isPlaying ? (
            <IconButton
              style={styles.playerButtons}
              icon="play"
              size={wp(12)}
              color={'#E0E0E0'}
              onPress={onPlay}
            />
          ) : (
            <IconButton
              style={styles.playerButtons}
              color={'#E0E0E0'}
              size={wp(12)}
              icon="pause"
              onPress={onPause}
            />
          )}
          <IconButton
            style={styles.playerButtons}
            size={wp(12)}
            icon="skip-next"
            color={'#E0E0E0'}
            onPress={onNext}
          />
        </View>
      </View>
    </View>
  );
}
