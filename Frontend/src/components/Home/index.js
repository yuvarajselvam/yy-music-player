import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {PlayerMain} from '../Player/player.main';
import {commonStyles} from '../common/styles';

export function Home() {
  useEffect(() => {
    console.log('Rendering Main.js');
  });
  return (
    <View style={commonStyles.screenStyle}>
      <PlayerMain trackObj={{id: '', songUrl: ''}} />
    </View>
  );
}
