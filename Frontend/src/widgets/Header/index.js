import React from 'react';
import {Appbar, Colors} from 'react-native-paper';

import {styles} from './header.styles';

export function Header(props) {
  const {
    navigation,
    title,
    leftIconName,
    onLeftIconPress,
    rightIconName,
    onRightIconPress,
  } = props;

  return (
    <Appbar style={styles.appHeader}>
      {leftIconName ? (
        <Appbar.Action
          icon={leftIconName}
          color="#E0E0E0"
          onPress={onLeftIconPress}
        />
      ) : (
        <Appbar.Action
          icon="menu"
          color="#E0E0E0"
          onPress={() => navigation.toggleDrawer()}
        />
      )}
      <Appbar.Content title={title} titleStyle={{color: Colors.grey200}} />
      {rightIconName ? (
        <Appbar.Action
          icon={rightIconName}
          color="#E0E0E0"
          onPress={onRightIconPress}
        />
      ) : (
        <Appbar.Action
          icon="magnify"
          color="#E0E0E0"
          onPress={() => navigation.navigate('Search')}
        />
      )}
    </Appbar>
  );
}
