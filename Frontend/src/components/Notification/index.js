import React from 'react';
import {View} from 'react-native';
import {ListItem} from 'react-native-elements';
import {Colors} from 'react-native-paper';

import {Header} from '../../widgets/Header';

export function Notification(props) {
  const {navigation} = props;

  return (
    <View style={{flex: 1}}>
      <Header
        title="Notification"
        navigation={navigation}
        leftIconName="arrow-back"
        onLeftIconPress={() => navigation.goBack()}
      />
      <ListItem
        containerStyle={{margin: 0, backgroundColor: '#121212'}}
        title={'Notifications'}
        titleStyle={{marginBottom: 4}}
        subtitle={'Coming soon !'}
        subtitleStyle={{color: Colors.grey200}}
      />
    </View>
  );
}
