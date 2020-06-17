import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Text, Input} from 'react-native-elements';

import {Header} from '../../shared/widgets/Header';

import {commonStyles} from '../common/styles';
import {styles} from './mymusic.styles';

export function MyMusic({navigation}) {
  return (
    <View style={commonStyles.screenStyle}>
      <Header navigation={navigation} title="My Music" />

      <Text
        style={{
          flex: 1,
          textAlign: 'center',
          textAlignVertical: 'center',
        }}>
        My Library
      </Text>
    </View>
  );
}
