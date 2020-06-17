import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-elements';
import {Colors} from 'react-native-paper';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

import {commonStyles} from '../common/styles';
import {Header} from '../../shared/widgets/Header';
import {MyPlaylists} from './MyPlaylists';
import {SharedPlaylists} from './SharedPlaylists';

import {styles} from './myplaylists.styles';
import {TouchableOpacity} from 'react-native-gesture-handler';

export function Playlists({navigation}) {
  return (
    <View style={commonStyles.screenStyle}>
      <Header title="Playlists" navigation={navigation} />
      <Tab.Navigator
        sceneContainerStyle={{backgroundColor: '#121212'}}
        tabBar={props => <CustomPlaylistTopbar {...props} />}>
        <Tab.Screen name="MyPlaylists" component={MyPlaylists} />
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
      <TouchableOpacity onPress={() => navigation.navigate('MyPlaylists')}>
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
