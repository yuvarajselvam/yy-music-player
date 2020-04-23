import React, {useContext} from 'react';
import {View} from 'react-native';
import {Slider, ListItem, Image} from 'react-native-elements';
import {IconButton, Colors} from 'react-native-paper';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {PlayerContext} from '../../contexts/player.context';

import {styles} from './player.styles';

export function PlayerMain() {
  const {
    isPlaying,
    duration,
    position,
    onPlay,
    onPause,
    trackDetails,
  } = useContext(PlayerContext);

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

  let trackImageUrl =
    trackDetails.imageUrl ||
    'https://imgplaceholder.com/420x320/cccccc/757575/glyphicon-cd';

  return (
    <View>
      <Slider
        style={styles.seekBar}
        value={position}
        minimumValue={0}
        maximumValue={duration}
        thumbStyle={{width: 0, height: 0}}
        thumbTouchSize={{width: 0, height: 0}}
        trackStyle={styles.seekBarTrack}
        minimumTrackTintColor="#651fff"
        maximumTrackTintColor="#FFFFFF"
      />
      <ListItem
        containerStyle={styles.miniPlayer}
        title={trackDetails.name}
        titleStyle={{
          fontSize: 13.2,
          paddingBottom: 2,
          fontWeight: 'bold',
          color: Colors.grey200,
        }}
        subtitle={trackDetails.artists}
        subtitleStyle={{
          fontSize: 12,
          color: Colors.grey200,
        }}
        leftElement={
          <Image
            style={styles.playerAlbumImage}
            source={{
              uri: trackImageUrl,
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
