import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  albumImage: {
    width: wp('80%'),
    height: hp('40%'),
    // padding: 50,
    // margin: 50,
  },
  listImage: {
    width: wp(12),
    height: hp(12),
  },
});
