import React, {useContext} from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';
import {Slider, ListItem, Image} from 'react-native-elements';
import {IconButton, Colors} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {useTrackPlayerProgress} from '../utils/player.hooks';
import {PlayerContext} from '../../../contexts/player.context';

import {styles} from './player.styles';

export function MiniPlayer(props) {
  const {navigation} = props;
  const {
    isPlaying,
    // duration,
    // position,
    onPlay,
    onPause,
    trackDetails,
  } = useContext(PlayerContext);

  const {bufferedPosition, duration, position} = useTrackPlayerProgress();

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
    <TouchableWithoutFeedback
      onPress={() => {
        console.log('Navigate to Main Player');
        navigation.navigate('Main Player');
      }}>
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
          maximumTrackTintColor={Colors.grey800}
        />
        <ListItem
          containerStyle={styles.miniPlayer}
          title={trackDetails.name}
          titleStyle={{
            fontSize: wp(3.4),
            paddingBottom: 2,
            fontWeight: 'bold',
            color: Colors.grey200,
          }}
          subtitle={trackDetails.artists}
          subtitleStyle={{
            fontSize: wp(2.8),
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
    </TouchableWithoutFeedback>
  );
}
