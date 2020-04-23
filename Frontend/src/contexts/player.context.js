import React, {useState, createContext, useEffect} from 'react';
import TrackPlayer from 'react-native-track-player';
import {
  usePlaybackState,
  useTrackPlayerProgress,
} from '../components/Player/player.hooks';
import {Alert} from 'react-native';

export const PlayerContext = createContext();

export const PlayerProvider = props => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackDetails, setTrackDetails] = useState({});

  const {bufferedPosition, duration, position} = useTrackPlayerProgress();

  const playbackState = usePlaybackState();

  useEffect(() => {
    TrackPlayer.setupPlayer().then(() => {
      console.log('Setting up the player');
      onUpdateOptions();
    });
    return () => onDestroy();
  }, []);

  const onAddTrack = async track => {
    console.log('onAddTrack is called');

    if (!track.trackUrl) {
      Alert.alert('No Songs Found!');
      return;
    }

    TrackPlayer.setupPlayer().then(async () => {
      let artistsName = track.artists.map(artist => {
        return artist.name;
      });
      let trackArtistsName = artistsName.join(', ');
      let details = {
        name: track.name,
        imageUrl: track.imageUrl,
        artists: trackArtistsName,
      };
      setTrackDetails(details);
      await TrackPlayer.add({
        id: track._id,
        url: track.trackUrl,
      });
    });
  };

  const onPlay = () => {
    console.log('OnPlay is called');
    setIsPlaying(true);
    TrackPlayer.play();
  };

  const onPause = () => {
    setIsPlaying(false);
    TrackPlayer.pause();
  };

  const onPrevious = () => {
    TrackPlayer.skipToPrevious();
  };

  const onNext = () => {
    TrackPlayer.skipToNext();
  };

  const onReset = () => {
    TrackPlayer.reset();
  };

  const onRemove = () => {
    TrackPlayer.remove();
  };

  const onDestroy = () => {
    TrackPlayer.destroy();
  };

  const onUpdateOptions = () => {
    TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      ],
    });
  };

  return (
    <PlayerContext.Provider
      value={{
        isPlaying: isPlaying,
        bufferedPosition: bufferedPosition,
        duration: duration,
        position: position,
        playbackState: playbackState,
        trackDetails: trackDetails,
        setIsPlaying: setIsPlaying,
        onAddTrack: onAddTrack,
        onPlay: onPlay,
        onPause: onPause,
        onPrevious: onPrevious,
        onNext: onNext,
        onReset: onReset,
        onRemove: onRemove,
        onDestroy: onDestroy,
      }}>
      {props.children}
    </PlayerContext.Provider>
  );
};
