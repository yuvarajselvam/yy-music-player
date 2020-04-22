import React from 'react';
import {Appbar} from 'react-native-paper';

import {styles} from './header.styles';

export function Header({navigation}) {
  return (
    <Appbar style={styles.appHeader}>
      <Appbar.Action
        icon="menu"
        color="#E0E0E0"
        onPress={() => navigation.toggleDrawer()}
      />
      <Appbar.Action
        icon="magnify"
        color="#E0E0E0"
        onPress={() => navigation.navigate('Search')}
      />
    </Appbar>
    // <View
    //   style={{
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    //     borderWidth: 0,
    //     borderRadius: widthPercentageToDP(4.4),
    //     padding: 0,
    //     margin: widthPercentageToDP(4),1
    //     // marginRight: widthPercentageToDP(2),
    //     backgroundColor: Colors.grey800,
    //   }}>
    //   <TouchableNativeFeedback
    //     onPress={() => navigation.navigate('Search')}
    //     background={TouchableNativeFeedback.Ripple(Colors.grey500, true)}>
    //     <View
    //       style={{
    //         flexDirection: 'row',
    //         justifyContent: 'space-between',
    //         alignItems: 'center',
    //         borderWidth: 0,
    //         borderRadius: widthPercentageToDP(4.4),
    //         padding: 0,
    //         // margin: widthPercentageToDP(4),
    //         // marginRight: widthPercentageToDP(2),
    //         backgroundColor: Colors.grey800,
    //       }}>
    //       <StatusBar backgroundColor={Colors.grey900} />
    //       <IconButton
    //         icon="menu"
    //         color="#E0E0E0"
    //         onPress={() => navigation.toggleDrawer()}
    //       />
    //       <View style={{flex: 1, padding: 0, margin: 0}}>
    //         <Text style={{color: Colors.grey300}}>Search songs</Text>
    //       </View>
    //       <Avatar
    //         containerStyle={{marginRight: widthPercentageToDP(2)}}
    //         rounded
    //         source={{
    //           uri:
    //             'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    //         }}
    //       />
    //     </View>
    //   </TouchableNativeFeedback>
    // </View>
  );
}
