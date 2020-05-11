import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {Colors} from 'react-native-paper';

export const styles = StyleSheet.create({
  albumImage: {
    width: wp('50%'),
    height: hp('25%'),
  },
  listImage: {
    width: wp(12),
    height: hp(12),
  },
  listContainer: {
    padding: 0,
    backgroundColor: '#121212',
    borderBottomWidth: 0,
  },
  contentContainerStyle: {padding: hp(1.8)},
  titleStyle: {
    color: Colors.grey200,
    paddingBottom: hp(0.4),
    fontWeight: 'bold',
    fontSize: wp(4),
  },
  listSubtitle: {
    color: Colors.grey500,
    fontSize: wp(3.2),
  },
});
