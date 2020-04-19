/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {IconButton, Colors} from 'react-native-paper';
import {Avatar} from 'react-native-elements';

import {styles} from './header.styles';
import {View, StatusBar, Text, TouchableNativeFeedback} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';

export function Header({navigation}) {
  return (
    // <Appbar.Header style={styles.appHeader} dark={true}>
    //   <Appbar.Action
    //     icon="menu"
    //     color="#E0E0E0"
    //     onPress={() => navigation.toggleDrawer()}
    //   />
    //   <Appbar.Action icon="bell" color="#E0E0E0" />
    // </Appbar.Header>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 0,
        borderRadius: widthPercentageToDP(3.2),
        padding: 0,
        margin: widthPercentageToDP(4),
        // marginRight: widthPercentageToDP(2),
        backgroundColor: Colors.grey800,
      }}>
      <TouchableNativeFeedback
        onPress={() => navigation.navigate('Search')}
        background={TouchableNativeFeedback.Ripple(Colors.grey500, true)}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderWidth: 0,
            borderRadius: widthPercentageToDP(3.2),
            padding: 0,
            // margin: widthPercentageToDP(4),
            // marginRight: widthPercentageToDP(2),
            backgroundColor: Colors.grey800,
          }}>
          <StatusBar backgroundColor={Colors.grey900} />
          <IconButton
            icon="menu"
            color="#E0E0E0"
            onPress={() => navigation.toggleDrawer()}
          />
          <View style={{flex: 1, padding: 0, margin: 0}}>
            <Text style={{color: Colors.grey300}}>Search songs</Text>
          </View>
          <Avatar
            containerStyle={{marginRight: widthPercentageToDP(2)}}
            rounded
            source={{
              uri:
                'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
            }}
          />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}
