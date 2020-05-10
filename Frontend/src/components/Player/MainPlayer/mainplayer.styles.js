import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  mainPlayerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  trackGradient: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
  },
  trackImage: {width: wp('80%'), height: hp('40%')},
  trackDetails: {
    alignSelf: 'center',
    marginBottom: 72,
  },
  trackTime: {flexDirection: 'row', justifyContent: 'space-between'},
  seekBar: {
    width: wp('90%'),
  },
  trackButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: hp(1),
    alignItems: 'center',
  },
});
