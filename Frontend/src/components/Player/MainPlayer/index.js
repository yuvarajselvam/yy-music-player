import React, {useContext, useState, useEffect} from 'react';
import {View, Image} from 'react-native';
import {Slider, Icon, Text} from 'react-native-elements';
import {Colors} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {getColorFromURL} from 'rn-dominant-color';
import LinearGradient from 'react-native-linear-gradient';

import {useTrackPlayerProgress} from '../utils/player.hooks';
import {PlayerContext} from '../../../contexts/player.context';

import {styles} from './mainplayer.styles';
import {Header} from '../../../widgets/Header';

export function MainPlayer(props) {
  const {navigation} = props;

  const {
    isPlaying,
    onPlay,
    onPause,
    updateSeekPosition,
    getTrackDetails,
  } = useContext(PlayerContext);

  const [trackColors, setTrackColors] = useState({
    primary: '#121212',
    secondary: '#121212',
    background: '#121212',
  });
  const [trackDetails, setTrackDetails] = useState({});
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isSliderPositionChanging, setIsSliderPositionChanging] = useState(
    false,
  );
  const [elapsedTime, setElapsedTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);

  const {bufferedPosition, duration, position} = useTrackPlayerProgress();

  useEffect(() => {
    if (!isSliderPositionChanging) {
      setElapsedTime(convertTime(position));
      setSliderPosition(position);
    }
    setTrackDuration(convertTime(duration));
    console.log(Math.round(position), convertTime(position));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, duration]);

  const convertTime = timeInSeconds => {
    var pad = function(num, size) {
        return ('000' + num).slice(size * -1);
      },
      time = parseFloat(timeInSeconds).toFixed(3),
      minutes = Math.floor(time / 60) % 60,
      seconds = Math.floor(time - minutes * 60);

    return pad(minutes, 2) + ':' + pad(seconds, 2);
  };

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      async function getTrack() {
        let trackObj = await getTrackDetails();
        setTrackDetails(trackObj);
        getColorFromURL(trackObj.artwork)
          .then(colors => setTrackColors(colors))
          .catch(error => {
            console.warn('Not a valid image', error);
          });
      }
      getTrack();
      return () => {};
    }, []),
  );

  const handlePositionStart = () => {
    setIsSliderPositionChanging(true);
  };

  const handlePositionComplete = val => {
    console.log(val);
    updateSeekPosition(val);
    setIsSliderPositionChanging(false);
  };

  const handlePositionChange = val => {
    let currentPosition = convertTime(val);
    setSliderPosition(val);
    setElapsedTime(currentPosition);
  };

  const PlayPauseButton = () => {
    return !isPlaying ? (
      <Icon
        animated={false}
        name="play"
        type="material-community"
        size={hp(6)}
        color={Colors.grey200}
        onPress={onPlay}
      />
    ) : (
      <Icon
        animated={false}
        color={Colors.grey200}
        type="material-community"
        size={hp(6)}
        name="pause"
        onPress={onPause}
      />
    );
  };

  return (
    <View style={styles.mainPlayerContainer}>
      <LinearGradient
        colors={[trackColors.secondary, '#101010']}
        style={styles.trackGradient}
      />
      <Header
        leftIconName="chevron-down"
        onLeftIconPress={() => navigation.goBack()}
        rightIconName="dots-vertical"
        onRightIconPress={() => console.log('album details')}
      />
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 14, marginBottom: 4}}>PLAYING FROM ALBUM</Text>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          {trackDetails.album}
        </Text>
      </View>
      <View style={{alignItems: 'center'}}>
        <Image
          source={{
            uri: trackDetails.artwork,
          }}
          style={styles.trackImage}
        />
      </View>
      <View style={styles.trackDetails}>
        <View>
          <Text style={{fontSize: 18, marginBottom: 4, fontWeight: 'bold'}}>
            {trackDetails.title}
          </Text>
          <Text>{trackDetails.artist}</Text>
        </View>
        <View style={{marginBottom: 12}}>
          <Slider
            style={styles.seekBar}
            value={sliderPosition}
            step={1}
            minimumValue={0}
            maximumValue={duration}
            thumbStyle={{width: 12, height: 12}}
            thumbTintColor={Colors.white}
            // thumbTouchSize={{width: 4, height: 4}}
            trackStyle={styles.seekBarTrack}
            onValueChange={handlePositionChange}
            onSlidingStart={handlePositionStart}
            onSlidingComplete={handlePositionComplete}
            minimumTrackTintColor={Colors.grey100}
            maximumTrackTintColor={Colors.grey800}
          />
          <View style={styles.trackTime}>
            <Text>{elapsedTime}</Text>
            <Text>{trackDuration}</Text>
          </View>
        </View>
        <View style={styles.trackButtonContainer}>
          <Icon
            style={styles.mainPlayerButton}
            color={Colors.grey200}
            size={hp(2.8)}
            name="shuffle-variant"
            type="material-community"
            onPress={onPause}
          />
          <Icon
            style={styles.mainPlayerButton}
            color={Colors.grey200}
            size={hp(6)}
            type="material-community"
            name="skip-previous"
            onPress={onPause}
          />
          <PlayPauseButton />
          <Icon
            style={styles.mainPlayerButton}
            color={Colors.grey200}
            size={hp(6)}
            name="skip-next"
            type="material-community"
            onPress={onPause}
          />
          <Icon
            style={styles.mainPlayerButton}
            color={Colors.grey200}
            size={hp(2.8)}
            name="repeat"
            type="material-community"
            onPress={onPause}
          />
        </View>
      </View>
    </View>
  );
}
