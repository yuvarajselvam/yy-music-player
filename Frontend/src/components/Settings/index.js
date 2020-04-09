import React from 'react';
import {View, Text} from 'react-native';
import {Appbar, IconButton, Colors} from 'react-native-paper';
import {Header} from '../../widgets/Header';

export function Settings({navigation}) {
  return (
    <React.Fragment>
      <Header navigation={navigation} />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{
            color: Colors.grey300,
          }}>
          Settings Page
        </Text>
      </View>
    </React.Fragment>
  );
}
