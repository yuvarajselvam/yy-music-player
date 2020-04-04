import React, {useState, createContext} from 'react';
import TrackPlayer from 'react-native-track-player';
import {
  usePlaybackState,
  useTrackPlayerProgress,
} from '../components/Player/player.hooks';

export const PlayerContext = createContext();

export const PlayerProvider = (props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const {bufferedPosition, duration, position} = useTrackPlayerProgress();

  const playbackState = usePlaybackState();

  const onAddTrack = async (id, songUrl) => {
    await TrackPlayer.add({
      id: id,
      url: songUrl,
    });
  };

  const onPlay = () => {
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

  const onSetupPlayer = () => {
    TrackPlayer.setupPlayer();
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
      value={[
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
      ]}>
      {props.children}
    </PlayerContext.Provider>
  );
};
