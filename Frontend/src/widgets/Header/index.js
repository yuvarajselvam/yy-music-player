import React from 'react';
import {Appbar} from 'react-native-paper';

import {styles} from './header.styles';

export function Header({navigation}) {
  return (
    <Appbar style={styles.appHeader}>
      <Appbar.Action
        icon="menu"
        color="#E0E0E0"
        onPress={() => navigation.toggleDrawer()}
      />
      <Appbar.Action
        icon="magnify"
        color="#E0E0E0"
        onPress={() => navigation.navigate('Search')}
      />
    </Appbar>
  );
}
