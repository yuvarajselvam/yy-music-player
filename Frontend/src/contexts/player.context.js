import React, {useState, createContext, useEffect, useContext} from 'react';
import TrackPlayer from 'react-native-track-player';
import {Alert} from 'react-native';

export const PlayerContext = createContext();

export const PlayerProvider = props => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackDetails, setTrackDetails] = useState({});

  useEffect(() => {
    TrackPlayer.setupPlayer().then(async () => {
      console.log('Setting up the player');
      onUpdateOptions();
      // TO DO - removed and should contain actual last played track
      await TrackPlayer.add({
        id: 'track.id',
        url: 'track.trackUrl',
        title: 'track.name',
        artist: 'trackArtistsName',
        album: 'track.album.name',
        artwork: 'track.imageUrl',
      });
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
      let details = {
        name: track.name,
        imageUrl: track.imageUrl,
        artists: track.artists,
      };
      setTrackDetails(details);
      await TrackPlayer.add({
        id: track.id,
        url: track.trackUrl,
        title: track.name,
        artist: track.artists,
        album: track.album.name,
        artwork: track.imageUrl,
      });
    });
  };

  const getTrackDetails = async () => {
    let trackId = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackId);
    return trackObject;
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

  const updateSeekPosition = interval => {
    console.log('Seek interval', interval);
    TrackPlayer.seekTo(interval);
  };

  const getCurrentTrackId = async () => {
    let trackId = await TrackPlayer.getCurrentTrack();
    return trackId;
  };

  return (
    <PlayerContext.Provider
      value={{
        isPlaying: isPlaying,
        trackDetails: trackDetails,
        getCurrentTrackId: getCurrentTrackId,
        getTrackDetails: getTrackDetails,
        setIsPlaying: setIsPlaying,
        onAddTrack: onAddTrack,
        updateSeekPosition: updateSeekPosition,
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

export function usePlayerContext() {
  return useContext(PlayerContext);
}
