import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {PlayerMain} from '../Player/player.main';

export function Home() {
  useEffect(() => {
    console.log('Rendering Main.js');
  });
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#000000',
      }}>
      <Text>Home Page</Text>
      <PlayerMain trackObj={{id: '', songUrl: ''}} />
    </View>
  );
}
