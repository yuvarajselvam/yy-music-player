import React from 'react';
import {Appbar, IconButton} from 'react-native-paper';

import {styles} from './header.styles';

export function Header({navigation}) {
  return (
    <Appbar.Header style={styles.appHeader} dark={true}>
      <Appbar.Action
        icon="menu"
        color="#E0E0E0"
        onPress={() => navigation.toggleDrawer()}
      />
      <Appbar.Action icon="bell" color="#E0E0E0" />
    </Appbar.Header>
  );
}
