import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Colors} from 'react-native-paper';

export const styles = StyleSheet.create({
  miniPlayer: {
    height: hp(8.4),
    backgroundColor: Colors.grey800,
    padding: 0,
    margin: 0,
    borderWidth: 0,
  },
  // duration: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   paddingLeft: 12,
  //   paddingRight: 12,
  //   justifyContent: 'space-between',
  //   alignItems: 'flex-end',
  // },
  seekBar: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  seekBarTrack: {height: hp(0.2), padding: 0, margin: 0},
  miniPlayerControls: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // height: hp(4),
  },
  playerButtonGroup: {
    borderWidth: 0,
    backgroundColor: Colors.grey800,
    padding: wp(1),
  },
  playerAlbumImage: {
    width: wp(16),
    height: hp(8.4),
  },
});
