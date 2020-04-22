import {StyleSheet} from 'react-native';
import {heightPercentageToDP} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: '#121212',
    borderTopWidth: 0,
    // height: heightPercentageToDP(6.4),
  },
  bottomBarIcon: {
    margin: 0,
    padding: 0,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
