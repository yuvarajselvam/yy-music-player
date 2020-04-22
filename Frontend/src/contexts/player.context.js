import React, {useState, createContext, useEffect} from 'react';
import TrackPlayer from 'react-native-track-player';
import {
  usePlaybackState,
  useTrackPlayerProgress,
} from '../components/Player/player.hooks';

export const PlayerContext = createContext();

export const PlayerProvider = props => {
  const [isPlaying, setIsPlaying] = useState(false);

  const {bufferedPosition, duration, position} = useTrackPlayerProgress();

  const playbackState = usePlaybackState();

  // useEffect(() => {
  //   console.log('Setting up the player');
  //   return () => onDestroy();
  // }, []);

  const onAddTrack = async (id, songUrl) => {
    console.log('onAddTrack is called');
    TrackPlayer.setupPlayer().then(async () => {
      onUpdateOptions();
      await TrackPlayer.add({
        id: id,
        url: songUrl,
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
