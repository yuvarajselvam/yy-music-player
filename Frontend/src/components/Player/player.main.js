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

  const onFavourite = () => {};

  const FavouriteButton = () => (
    <IconButton
      size={hp(4)}
      icon="heart"
      color={Colors.grey200}
      onPress={onFavourite}
    />
  );

  const PlayPauseButton = () => {
    return !isPlaying ? (
      <IconButton
        icon="play"
        size={hp(7.2)}
        color={Colors.grey200}
        onPress={onPlay}
      />
    ) : (
      <IconButton
        color={Colors.grey200}
        size={hp(7.2)}
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
        minimumTrackTintColor="#6a0080"
        maximumTrackTintColor="#d05ce3"
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
        buttonGroup={{
          buttons: [
            {
              element: FavouriteButton,
            },
            {
              element: PlayPauseButton,
            },
          ],
          containerStyle: styles.playerButtonGroup,
          innerBorderStyle: {width: 0},
        }}
      />
    </View>
  );
}
