import React, {useEffect, useContext} from 'react';
import {View} from 'react-native';
import {Slider, ListItem, Image} from 'react-native-elements';
import {IconButton, Colors} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {PlayerContext} from '../../contexts/player.context';

import {styles} from './player.styles';

export function PlayerMain({trackObj}) {
  const [
    onAddTrack,
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
    if (trackObj.songUrl.length > 1) {
      onAddTrack(trackObj.id, trackObj.songUrl);
      onReset();
      console.log('Autoplaying initialising');
      onPlay();
      setIsPlaying(true);
    }
  }, [trackObj.songUrl]);

  useEffect(() => {
    console.log('UseEffect PLAYER');
    onUpdateOptions();
    return () => onDestroy();
  }, []);

  const onFavourite = () => {};

  const FavouriteButton = () => (
    <IconButton
      style={styles.miniPlayerButton}
      size={hp(4)}
      icon="heart"
      color={Colors.grey200}
      onPress={onFavourite}
    />
  );

  const PlayPauseButton = () => {
    return !isPlaying ? (
      <IconButton
        style={styles.miniPlayerButton}
        icon="play"
        size={hp(6)}
        color={Colors.grey200}
        onPress={onPlay}
      />
    ) : (
      <IconButton
        style={styles.miniPlayerButton}
        color={Colors.grey200}
        size={hp(6)}
        icon="pause"
        onPress={onPause}
      />
    );
  };

  return (
    <View>
      <Slider
        style={styles.seekBar}
        value={position}
        minimumValue={0}
        maximumValue={duration}
        thumbStyle={{display: 'none'}}
        trackStyle={styles.seekBarTrack}
        minimumTrackTintColor="#0026ca"
        maximumTrackTintColor="#7a7cff"
      />
      <ListItem
        containerStyle={styles.miniPlayer}
        leftElement={
          <Image
            style={styles.playerAlbumImage}
            source={{
              uri:
                'https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f',
            }}
          />
        }
        rightElement={
          <View style={styles.playerButtonGroup}>
            <FavouriteButton />
            <PlayPauseButton />
          </View>
        }
      />
    </View>
  );
}
