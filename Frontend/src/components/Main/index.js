import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {Appbar, IconButton} from 'react-native-paper';

import {Search} from '../Search';
import {MyLibrary} from '../MyLibrary';
import {Home} from '../Home';

import {PlayerProvider} from '../../contexts/player.context';
import {styles} from './main.styles';

const Tab = createMaterialBottomTabNavigator();

export function Main({navigation}) {
  return (
    <React.Fragment>
      <Appbar.Header style={styles.appHeader} dark={true}>
        <Appbar.Action
          icon="menu"
          color="#E0E0E0"
          onPress={() => navigation.toggleDrawer()}
        />
        <Appbar.Action icon="bell" color="#E0E0E0" />
      </Appbar.Header>
      <PlayerProvider>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Search') {
                iconName = 'compass';
              } else if (route.name === 'My Library') {
                iconName = 'book-multiple';
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
          activeColor="#d05ce3"
          sceneAnimationEnabled={true}
          barStyle={styles.bottomBar}>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Search" component={Search} />
          <Tab.Screen name="My Library" component={MyLibrary} />
        </Tab.Navigator>
      </PlayerProvider>
    </React.Fragment>
  );
}
