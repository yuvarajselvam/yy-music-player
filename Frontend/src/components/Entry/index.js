import React, {useEffect} from 'react';
import {View, Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {Divider, Icon} from 'react-native-elements';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Colors} from 'react-native-paper';

import {Main} from '../Main';
import {Settings} from '../Settings';
import {styles} from './entry.styles';
import {MainPlayer} from '../Player/MainPlayer';
import {MyProfile} from '../MyProfile';
import {Followers} from '../Social/Followers';
import {Following} from '../Social/Following';
import {Notification} from '../Notification';
import {Users} from '../Social/Users';
import {PlayerProvider} from '../../contexts/player.context';
import {Requests} from '../Social/Requests';
import {Groups} from '../Social/Groups';
import {Group} from '../Social/Groups/Group';

import {mySync} from '../../utils/db/model/sync';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = React.memo(function CustomDrawerContent({
  navigation,
}) {
  return (
    <DrawerContentScrollView>
      <DrawerItem
        label="YY Music Player"
        labelStyle={styles.drawerHeaderLabel}
      />
      <Divider style={{backgroundColor: Colors.grey200}} />
      <View>
        <DrawerItem
          label="Home"
          labelStyle={styles.drawerLabel}
          icon={() => (
            <Icon
              containerStyle={styles.drawerIcon}
              color={Colors.grey200}
              size={wp(6.4)}
              name={'home'}
            />
          )}
          onPress={() => navigation.navigate('Home')}
        />
        <DrawerItem
          label="My Profile"
          labelStyle={styles.drawerLabel}
          icon={() => (
            <Icon
              containerStyle={styles.drawerIcon}
              color={Colors.grey200}
              size={wp(6.4)}
              name={'account-circle'}
            />
          )}
          onPress={() => navigation.navigate('My Profile')}
        />
        <DrawerItem
          label="People"
          labelStyle={styles.drawerLabel}
          icon={() => (
            <Icon
              containerStyle={styles.drawerIcon}
              color={Colors.grey200}
              size={wp(6.4)}
              name={'supervisor-account'}
            />
          )}
          onPress={() => navigation.navigate('Users')}
        />
        <DrawerItem
          label="Groups"
          labelStyle={styles.drawerLabel}
          icon={() => (
            <Icon
              containerStyle={styles.drawerIcon}
              color={Colors.grey200}
              size={wp(6.4)}
              name={'group'}
            />
          )}
          onPress={() => navigation.navigate('Groups')}
        />
        <DrawerItem
          label="Music Languages"
          labelStyle={styles.drawerLabel}
          icon={() => (
            <Icon
              containerStyle={styles.drawerIcon}
              color={Colors.grey200}
              size={wp(6.4)}
              name={'language'}
            />
          )}
          onPress={() => navigation.navigate('Settings')}
        />
        <DrawerItem
          style={{margin: 0, padding: 0}}
          label="Settings"
          labelStyle={styles.drawerLabel}
          icon={() => (
            <Icon
              containerStyle={styles.drawerIcon}
              color={Colors.grey200}
              size={wp(6.4)}
              name={'settings'}
            />
          )}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
    </DrawerContentScrollView>
  );
});

export function Entry() {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.notification) {
        Alert.alert(
          'You got a notification !',
          remoteMessage.notification.title,
          [
            {
              text: 'Ok',
              onPress: () => null,
            },
          ],
        );
      }
      console.log('Notification', remoteMessage.data);
      if (remoteMessage.data.type === 'sync_now') {
        await mySync();
      }
    });

    return unsubscribe;
  }, []);

  return (
    <PlayerProvider>
      <Drawer.Navigator
        sceneContainerStyle={styles.sceneContainer}
        drawerStyle={styles.drawer}
        drawerContent={props => <CustomDrawerContent {...props} />}
        edgeWidth={wp(12)}
        initialRouteName="Main">
        <Drawer.Screen name="Main" component={Main} />
        <Drawer.Screen name="Main Player" component={MainPlayer} />
        <Drawer.Screen name="Notification" component={Notification} />
        <Drawer.Screen name="My Profile" component={MyProfile} />
        <Drawer.Screen name="Users" component={Users} />
        <Drawer.Screen name="Groups" component={Groups} />
        <Drawer.Screen name="Group" component={Group} />
        <Drawer.Screen name="Requests" component={Requests} />
        <Drawer.Screen name="Followers" component={Followers} />
        <Drawer.Screen name="Following" component={Following} />
        <Drawer.Screen name="Settings" component={Settings} />
      </Drawer.Navigator>
    </PlayerProvider>
  );
}
