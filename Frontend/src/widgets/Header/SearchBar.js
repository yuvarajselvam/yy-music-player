import React from 'react';
import {View, TouchableNativeFeedback} from 'react-native';
import {Avatar, Text} from 'react-native-elements';
import {Colors, IconButton} from 'react-native-paper';
import {widthPercentageToDP} from 'react-native-responsive-screen';

export function SearchBar({navigation}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 0,
        borderRadius: widthPercentageToDP(4.4),
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
            borderRadius: widthPercentageToDP(4.4),
            padding: 0,
            // margin: widthPercentageToDP(4),
            // marginRight: widthPercentageToDP(2),
            backgroundColor: Colors.grey800,
          }}>
          <IconButton
            icon="menu"
            color="#E0E0E0"
            onPress={() => navigation.toggleDrawer()}
          />
          <View style={{flex: 1, padding: 0, margin: 0}}>
            <Text style={{color: Colors.grey200}}>Search songs</Text>
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
