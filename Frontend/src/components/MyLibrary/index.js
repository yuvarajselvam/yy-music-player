import React from 'react';
import {View, Text} from 'react-native';
import {commonStyles} from '../common/styles';
import {PlayerMain} from '../Player/player.main';

export function MyLibrary() {
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
      <PlayerMain trackObj={{songUrl: '', id: ''}} />
    </View>
  );
}
