import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  playerContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  playerButtons: {
    color: '#FFFFFF',
  },
  miniPlayer: {
    // flex: 1,
    borderColor: '#0000FF',
  },
  trackBar: {
    // flex: 1,
    backgroundColor: '#000000',
    margin: 0,
    padding: 0,
  },
  duration: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  seekBar: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  seekBarTrack: {height: hp(0.2)},
  miniPlayerControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  playerButtons: {padding: 0, margin: 0},
});
