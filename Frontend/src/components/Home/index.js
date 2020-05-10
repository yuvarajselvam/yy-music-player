import React, {useEffect} from 'react';
import {View} from 'react-native';

import {commonStyles} from '../common/styles';
import {Header} from '../../widgets/Header';

export function Home({navigation}) {
  useEffect(() => {
    console.log('Rendering Home.js');
  }, []);

  return (
    <View style={commonStyles.screenStyle}>
      <Header navigation={navigation} title="Home" />
      <View />
    </View>
  );
}
