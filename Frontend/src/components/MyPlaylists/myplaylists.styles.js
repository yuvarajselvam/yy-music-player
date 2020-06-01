import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Colors} from 'react-native-paper';

export const styles = StyleSheet.create({
  playlistTopbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: '#FFFFFF',
    height: hp('5%'),
    borderBottomWidth: 0.2,
    borderTopWidth: 0.2,
    borderColor: Colors.grey800,
  },
});
