import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: hp(6.4),
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 0,
  },
});
