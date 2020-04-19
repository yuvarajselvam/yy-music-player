import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {IconButton} from 'react-native-paper';

import {MyMusic} from '../MyMusic';
import {Home} from '../Home';

import {PlayerProvider} from '../../contexts/player.context';
import {styles} from './main.styles';
import {Header} from '../../widgets/Header';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {MyPlaylist} from '../MyPlaylist';
import {Search} from '../Search';

const Tab = createBottomTabNavigator();

export function Main({navigation}) {
  return (
    <React.Fragment>
      {/* <PlayerProvider> */}
      <Header navigation={navigation} />
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Playlist') {
              iconName = focused ? 'playlist-music' : 'playlist-music-outline';
            } else if (route.name === 'My Music') {
              iconName = 'music';
            }
            return <IconButton icon={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          style: styles.bottomBar,
          labelStyle: {padding: 0, marginBottom: heightPercentageToDP(0.6)},
          activeTintColor: '#7a7cff',
        }}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Playlist" component={MyPlaylist} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="My Music" component={MyMusic} />
      </Tab.Navigator>
      {/* </PlayerProvider> */}
    </React.Fragment>
  );
}
