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
import {Avatar, Text} from 'react-native-elements';
import {View} from 'react-native';

import {Main} from '../Main';
import {Settings} from '../Settings';
import {styles} from './entry.styles';

const Drawer = createDrawerNavigator();

function CustomDrawerContent({navigation}) {
  return (
    <DrawerContentScrollView>
      <View
        style={{
          // flex: 1,
          // margin: wp(1),
          padding: wp(4),
          backgroundColor: Colors.grey700,
        }}>
        <Avatar
          size={hp(8)}
          rounded
          source={{
            uri:
              'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
          }}
        />
        <View
          style={{
            marginTop: hp(2),
          }}>
          <Text
            style={{
              fontSize: wp(4.8),
              fontWeight: 'bold',
              color: Colors.grey300,
            }}>
            Jon Snow
          </Text>
          <Text style={{fontSize: wp(3.8), color: Colors.grey300}}>
            jonsnow@gmail.com
          </Text>
        </View>
      </View>
      <View>
        <DrawerItem
          label="Home"
          labelStyle={styles.drawerLabel}
          icon={() => (
            <IconButton
              style={styles.drawerIcon}
              color={Colors.grey300}
              size={wp(4.8)}
              icon={'home'}
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
              size={wp(4.8)}
              icon={'account-multiple'}
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
              size={wp(4.8)}
              icon={'map-marker'}
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
              size={wp(4.8)}
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
          label="Settings"
          labelStyle={styles.drawerLabel}
          icon={() => (
            <IconButton
              style={styles.drawerIcon}
              color={Colors.grey300}
              size={wp(4.8)}
              icon={'settings'}
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
      minSwipeDistance={wp(12)}
      sceneContainerStyle={styles.sceneContainer}
      drawerStyle={styles.drawer}
      drawerContentOptions={{
        itemStyle: styles.drawerItems,
        labelStyle: styles.drawerLabel,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="Main">
      <Drawer.Screen name="Home" component={Main} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
}
