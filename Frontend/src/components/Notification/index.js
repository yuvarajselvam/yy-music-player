import React from 'react';
import {View} from 'react-native';

import {Header} from '../../widgets/Header';
import ListItems from '../../widgets/ListItems';

function NotificationComponent(props) {
  const {navigation} = props;

  return (
    <View style={{flex: 1}}>
      <Header
        title="Notification"
        navigation={navigation}
        leftIconName="arrow-back"
        onLeftIconPress={() => navigation.goBack()}
      />
      <ListItems titleText="Notification" subtitleText="Coming soon !" />
    </View>
  );
}

const Notification = React.memo(NotificationComponent);

export {Notification};
