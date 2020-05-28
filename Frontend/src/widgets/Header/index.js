import React from 'react';
import {Appbar, Colors} from 'react-native-paper';

import {styles} from './header.styles';
import {Icon} from 'react-native-elements';
import {View, TouchableWithoutFeedback} from 'react-native';

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
        <TouchableWithoutFeedback onPress={onLeftIconPress}>
          <View>
            <Icon name={leftIconName} color="#E0E0E0" />
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback onPress={() => navigation.toggleDrawer()}>
          <View>
            <Icon name="menu" color="#E0E0E0" />
          </View>
        </TouchableWithoutFeedback>
      )}
      <Appbar.Content title={title} titleStyle={{color: Colors.grey200}} />
      <TouchableWithoutFeedback onPress={onRightIconPress}>
        <View style={{alignItems: 'center'}}>
          <Icon
            name={rightIconName}
            color="#E0E0E0"
            onPress={onRightIconPress}
            type={'material-community'}
          />
        </View>
      </TouchableWithoutFeedback>
    </Appbar>
  );
}
