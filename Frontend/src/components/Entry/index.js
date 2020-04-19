import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Colors, IconButton} from 'react-native-paper';
import {Avatar, Text, Divider} from 'react-native-elements';
import {View} from 'react-native';

import {Main} from '../Main';
import {Settings} from '../Settings';
import {styles} from './entry.styles';
import {Search} from '../Search';

const Drawer = createDrawerNavigator();

function CustomDrawerContent({navigation}) {
  return (
    <DrawerContentScrollView>
      <DrawerItem
        label="YY Music Player"
        labelStyle={styles.drawerHeaderLabel}
      />
      <Divider style={{backgroundColor: Colors.grey300}} />
      <View>
        <DrawerItem
          label="Home"
          labelStyle={styles.drawerLabel}
          icon={() => (
            <IconButton
              style={styles.drawerIcon}
              color={Colors.grey300}
              size={wp(6.4)}
              icon={'home-outline'}
            />
          )}
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'Home',
            })
          }
        />
        <DrawerItem
          label="People"
          labelStyle={styles.drawerLabel}
          icon={() => (
            <IconButton
              style={styles.drawerIcon}
              color={Colors.grey300}
              size={wp(6.4)}
              icon={'account-multiple-outline'}
            />
          )}
          onPress={() => navigation.navigate('Home')}
        />
        <DrawerItem
          label="Music Languages"
          labelStyle={styles.drawerLabel}
          icon={() => (
            <IconButton
              style={styles.drawerIcon}
              color={Colors.grey300}
              size={wp(6.4)}
              icon={'map-marker-outline'}
            />
          )}
          onPress={() => navigation.navigate('Settings')}
        />
        <DrawerItem
          label="Equalizer"
          labelStyle={styles.drawerLabel}
          icon={() => (
            <IconButton
              style={styles.drawerIcon}
              color={Colors.grey300}
              size={wp(6.4)}
              icon={'tune'}
            />
          )}
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'Home',
            })
          }
        />
        <DrawerItem
          style={{margin: 0, padding: 0}}
          label="Settings"
          labelStyle={styles.drawerLabel}
          icon={() => (
            <IconButton
              style={styles.drawerIcon}
              color={Colors.grey300}
              size={wp(6.4)}
              icon={'settings-outline'}
            />
          )}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export function Entry() {
  return (
    <Drawer.Navigator
      sceneContainerStyle={styles.sceneContainer}
      drawerStyle={styles.drawer}
      drawerContent={props => <CustomDrawerContent {...props} />}
      edgeWidth={wp(24)}
      initialRouteName="Main">
      <Drawer.Screen name="Home" component={Main} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="Search" component={Search} />
    </Drawer.Navigator>
  );
}
