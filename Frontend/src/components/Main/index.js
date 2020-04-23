import React from 'react';
import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {IconButton, Colors} from 'react-native-paper';

import {MyMusic} from '../MyMusic';
import {Home} from '../Home';

import {PlayerMain} from '../Player';

// import {styles} from './main.styles';
import {MyPlaylists} from '../MyPlaylists';
import {Search} from '../Search';
import {Album} from '../Album';
import {Playlist} from '../Playlist';

const Tab = createBottomTabNavigator();

export function Main({navigation}) {
  return (
    <Tab.Navigator
      initialRouteName={'Home'}
      tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="MyPlaylist" component={MyPlaylists} />
      <Tab.Screen name="Playlist" component={Playlist} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="My Music" component={MyMusic} />
      <Tab.Screen name="Album" component={Album} />
    </Tab.Navigator>
  );
}

function CustomTabBar(props) {
  // console.log('Custom Tab Bar', props);
  const {navigation} = props;
  return (
    <View>
      <PlayerMain />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          backgroundColor: '#171717',
        }}>
        <IconButton
          onPress={() => navigation.navigate('Home')}
          icon={'home'}
          size={24}
          color={Colors.white}
        />
        {/* <IconButton
          onPress={() => navigation.navigate('Search')}
          icon={'magnify'}
          size={24}
          color={Colors.white}
        /> */}
        <IconButton
          onPress={() => navigation.navigate('MyPlaylist')}
          icon={'playlist-music'}
          size={24}
          color={Colors.white}
        />
        <IconButton
          onPress={() => navigation.navigate('My Music')}
          icon={'music'}
          size={24}
          color={Colors.white}
        />
      </View>
    </View>
  );
}

// screenOptions={({route}) => ({
//   tabBarIcon: ({focused, color, size}) => {
//     let iconName;
//     if (route.name === 'Home') {
//       iconName = focused ? 'home' : 'home-outline';
//     } else if (route.name === 'Playlist') {
//       iconName = focused ? 'playlist-music' : 'playlist-music-outline';
//     } else if (route.name === 'My Music') {
//       iconName = 'music';
//     }
//     return <IconButton icon={iconName} size={size} color={color} />;
//   },
// })}
// tabBarOptions={{
//   style: styles.bottomBar,
//   labelStyle: {padding: 0, marginBottom: heightPercentageToDP(0.6)},
//   activeTintColor: '#7a7cff',
// }}
