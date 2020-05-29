import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    padding: wp(1),
  },
  modelBackdrop: {
    width: wp('100%'),
    height: hp('100%'),
    position: 'absolute',
    opacity: 0.8,
    backgroundColor: '#000000',
  },
  overlayContent: {
    backgroundColor: '#121212',
  },
});
