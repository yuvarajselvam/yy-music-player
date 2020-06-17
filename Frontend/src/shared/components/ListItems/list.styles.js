import {StyleSheet} from 'react-native';
import {Colors} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#121212',
    borderWidth: 0,
    padding: wp(2.8),
  },
  title: {
    fontSize: wp(4),
    color: Colors.grey200,
    paddingBottom: hp(0.2),
  },
  subtitle: {
    fontSize: wp(3.2),
    color: Colors.grey500,
    paddingTop: hp(0.2),
  },
  listSelectedStyle: {
    backgroundColor: Colors.deepPurpleA700,
    opacity: 0.9,
  },
});
