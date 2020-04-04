import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {widthPercentageToDP} from 'react-native-responsive-screen';

import {Main} from '../Main';
import {styles} from './entry.styles';

const Drawer = createDrawerNavigator();

export function Entry() {
  return (
    <Drawer.Navigator
      drawerType="slide"
      minSwipeDistance={widthPercentageToDP(12)}
      sceneContainerStyle={styles.sceneContainer}
      drawerStyle={styles.drawer}
      drawerContentOptions={{
        itemStyle: styles.drawerItems,
        labelStyle: styles.drawerLabel,
      }}
      initialRouteName="Main">
      <Drawer.Screen name="Main" component={Main} />
    </Drawer.Navigator>
  );
}
