import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {IconButton} from 'react-native-paper';

import {Search} from '../Search';
import {MyLibrary} from '../MyLibrary';
import {Home} from '../Home';

import {PlayerProvider} from '../../contexts/player.context';
import {styles} from './main.styles';
import {Header} from '../../widgets/Header';

const Tab = createMaterialBottomTabNavigator();

export function Main({navigation}) {
  return (
    <React.Fragment>
      <Header navigation={navigation} />
      <PlayerProvider>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Search') {
                iconName = 'compass';
              } else if (route.name === 'Playlist') {
                iconName = 'playlist-music-outline';
              } else if (route.name === 'My Library') {
                iconName = 'library-music';
              }
              return (
                <IconButton
                  style={styles.bottomBarIcon}
                  icon={iconName}
                  size={size}
                  color={color}
                />
              );
            },
          })}
          labeled={true}
          activeColor="#d05ce3"
          sceneAnimationEnabled={true}
          barStyle={styles.bottomBar}>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Search" component={Search} />
          <Tab.Screen name="Playlist" component={MyLibrary} />
          <Tab.Screen name="My Library" component={MyLibrary} />
        </Tab.Navigator>
      </PlayerProvider>
    </React.Fragment>
  );
}
