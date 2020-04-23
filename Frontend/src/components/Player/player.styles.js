import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Colors} from 'react-native-paper';

export const styles = StyleSheet.create({
  miniPlayer: {
    height: hp(8.4),
    backgroundColor: '#4d4d4d',
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
  miniPlayerButton: {padding: 0, margin: 0},
  seekBar: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  seekBarTrack: {height: hp(0.4), padding: 0, margin: 0},
  playerButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  playerAlbumImage: {
    width: wp(16),
    height: hp(8.4),
  },
});
