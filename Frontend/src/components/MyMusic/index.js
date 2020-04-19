import React from 'react';
import {View, Text} from 'react-native';
import {commonStyles} from '../common/styles';
import {PlayerMain} from '../Player/player.main';
import {PlayerProvider} from '../../contexts/player.context';

export function MyMusic() {
  return (
    <View style={commonStyles.screenStyle}>
      <Text
        style={{
          flex: 1,
          color: '#FFFFFF',
          textAlign: 'center',
          textAlignVertical: 'center',
        }}>
        My Library
      </Text>
      <PlayerProvider>
        <PlayerMain trackObj={{songUrl: '', id: ''}} />
      </PlayerProvider>
    </View>
  );
}
