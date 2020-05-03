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
    paddingLeft: 12,
    paddingRight: 4,
    backgroundColor: Colors.grey900,
    borderBottomWidth: 0,
  },
  listSubtitle: {
    color: Colors.grey200,
    fontStyle: 'italic',
    fontSize: 14,
  },
});
