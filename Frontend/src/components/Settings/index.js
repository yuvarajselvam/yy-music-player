import React from 'react';
import {View} from 'react-native';
import {Header} from '../../widgets/Header';

import {commonStyles} from '../common/styles';
import {MiniPlayer} from '../Player/MiniPlayer';

export function Settings({navigation}) {
  return (
    <View style={commonStyles.screenStyle}>
      <Header navigation={navigation} title="Settings" />
      <MiniPlayer />
    </View>
  );
}
