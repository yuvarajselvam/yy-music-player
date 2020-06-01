import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-elements';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

import {commonStyles} from '../common/styles';
import {Header} from '../../widgets/Header';
import {Playlists} from './Playlists/playlists';
import {SharedPlaylists} from './SharedPlaylists';

import {styles} from './myplaylists.styles';
import {Colors} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';

export function MyPlaylists() {
  return (
    <View style={commonStyles.screenStyle}>
      <Header title="Playlist" />
      <Tab.Navigator
        sceneContainerStyle={{backgroundColor: '#121212'}}
        tabBar={props => <CustomPlaylistTopbar {...props} />}
        initialRouteName="Playlists">
        <Tab.Screen name="Playlists" component={Playlists} />
        <Tab.Screen name="Shared Playlists" component={SharedPlaylists} />
      </Tab.Navigator>
    </View>
  );
}

function CustomPlaylistTopbar(props) {
  const {navigation, state} = props;

  console.log('playlist', state);

  const currentIndex = state.index;

  return (
    <View style={styles.playlistTopbar}>
      <TouchableOpacity onPress={() => navigation.navigate('Playlists')}>
        <Text
          style={[
            currentIndex === 0 ? {fontWeight: 'bold'} : null,
            {color: Colors.grey200},
          ]}>
          My Playlists
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Shared Playlists')}>
        <Text
          style={[
            currentIndex === 1 ? {fontWeight: 'bold'} : null,
            {color: Colors.grey200},
          ]}>
          Shared with me
        </Text>
      </TouchableOpacity>
    </View>
  );
}
