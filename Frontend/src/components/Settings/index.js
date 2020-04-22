import React from 'react';
import {View} from 'react-native';
import {Header} from '../../widgets/Header';

import {commonStyles} from '../common/styles';
import {PlayerMain} from '../Player';

export function Settings({navigation}) {
  return (
    <View style={commonStyles.screenStyle}>
      <Header navigation={navigation} />
      <PlayerMain />
    </View>
  );
}
