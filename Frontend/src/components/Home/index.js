import React, {useEffect} from 'react';
import {View} from 'react-native';

import {commonStyles} from '../common/styles';
import {Header} from '../../widgets/Header';
import {Text} from 'react-native-elements';

export function Home({navigation}) {
  useEffect(() => {
    console.log('Rendering Home.js');
  }, []);

  return (
    <View style={commonStyles.screenStyle}>
      <Header
        navigation={navigation}
        title="Home"
        rightIconName="notifications"
        onRightIconPress={() => navigation.navigate('Notification')}
      />
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Home Screen Coming soon !</Text>
      </View>
    </View>
  );
}
