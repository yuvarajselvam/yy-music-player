import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-elements';

import {commonStyles} from '../common/styles';
import {Header} from '../../widgets/Header';

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
