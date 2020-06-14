import React from 'react';
import {View} from 'react-native';
import {createStackNavigator, TransitionSpecs} from '@react-navigation/stack';
import {IconButton, Colors} from 'react-native-paper';

import {MyMusic} from '../MyMusic';
import {Home} from '../Home';

import {MiniPlayer} from '../Player/MiniPlayer';

import {Search} from '../Search';
import {Album} from '../Album';
import {Playlists} from '../Playlists';
import {Playlist} from '../Playlists/Playlist';

const stack = createStackNavigator();

export function Main({navigation}) {
  return (
    <React.Fragment>
      <stack.Navigator
        screenOptions={{
          gestureEnabled: true,
          animationEnabled: false,
          // gestureDirection: 'horizontal',
          // transitionSpec: {
          //   open: TransitionSpecs.ScaleFromCenterAndroidSpec,
          //   close: TransitionSpecs.ScaleFromCenterAndroidSpec,
          // },
        }}
        headerMode="none"
        initialRouteName={'Home'}>
        <stack.Screen name="Home" component={Home} />
        <stack.Screen name="Playlists" component={Playlists} />
        <stack.Screen name="Search" component={Search} />
        <stack.Screen name="My Music" component={MyMusic} />
        <stack.Screen name="Album" component={Album} />
      </stack.Navigator>
      <CustomTabBar navigation={navigation} />
    </React.Fragment>
  );
}

function CustomTabBar(props) {
  // console.log('Custom Tab Bar', props);
  const {navigation} = props;
  return (
    <View>
      <MiniPlayer navigation={navigation} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          backgroundColor: '#141414',
        }}>
        <IconButton
          onPress={() => navigation.navigate('Home')}
          icon={'home'}
          size={24}
          color={Colors.white}
        />
        <IconButton
          onPress={() => navigation.navigate('Search')}
          icon={'magnify'}
          size={24}
          color={Colors.white}
        />
        <IconButton
          onPress={() => navigation.navigate('Playlists')}
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
