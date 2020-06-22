import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  appHeader: {
    marginLeft: wp(2.8),
    marginRight: wp(2.8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 0,
  },
});
