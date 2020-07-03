import React, {useState} from 'react';
import {View} from 'react-native';
import {Image} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {Feed} from './Feed';
import {Header} from '../../../../shared/widgets/Header';
import {GroupPlaylists} from './GroupPlaylists';
import {Members} from './Members';
import {groupService} from '../../../../services/group.service';

const Tab = createMaterialTopTabNavigator();

export function Group(props) {
  const {route, navigation} = props;
  // console.log(route);
  const groupId = route.params.groupId;

  const [group, setGroup] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      let data = {
        id: groupId,
      };
      groupService.getGroup(data).then(async response => {
        if (response.status === 200) {
          let responseData = await response.json();
          setGroup(responseData);
        }
      });
    }, [groupId]),
  );

  return (
    <View style={{flex: 1}}>
      <Header title={group.name} navigation={navigation} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          padding: widthPercentageToDP(4),
        }}>
        <Image
          source={{uri: 'album.imageUrl'}}
          style={{
            width: widthPercentageToDP('50%'),
            height: heightPercentageToDP('25%'),
          }}
        />
      </View>

      <Tab.Navigator sceneContainerStyle={{backgroundColor: '#121212'}}>
        <Tab.Screen name="Feed" component={Feed} />
        <Tab.Screen name="Group Playlists">
          {prop => <GroupPlaylists {...prop} groupId={groupId} />}
        </Tab.Screen>
        <Tab.Screen name="Members">
          {prop => <Members {...prop} groupId={groupId} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}
