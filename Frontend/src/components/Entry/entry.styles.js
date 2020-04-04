import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {Colors} from 'react-native-paper';

export const styles = StyleSheet.create({
  sceneContainer: {backgroundColor: '#0000FF'},
  drawer: {backgroundColor: '#000000'},
  drawerItems: {backgroundColor: Colors.grey800},
  drawerLabel: {color: '#FFFFFF', width: wp(12)},
});
