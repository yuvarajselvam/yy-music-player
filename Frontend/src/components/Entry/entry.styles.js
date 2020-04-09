import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Colors} from 'react-native-paper';

export const styles = StyleSheet.create({
  sceneContainer: {backgroundColor: Colors.grey900},
  drawer: {backgroundColor: Colors.grey900},
  drawerItems: {backgroundColor: 'transparent', padding: 0, margin: 0},
  drawerLabel: {
    color: Colors.grey300,
    fontSize: wp(3.6),
    width: wp(30),
    margin: 0,
    padding: 0,
  },
  drawerIcon: {padding: 0, margin: 0},
});
