import {StyleSheet} from 'react-native';
import {Colors} from 'react-native-paper';
import {
  //   heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  listContainer: {
    padding: 0,
    paddingLeft: 12,
    paddingRight: 4,
    backgroundColor: Colors.grey900,
    borderBottomWidth: 0,
  },
  overlayContainer: {flex: 1, opacity: 0.7, backgroundColor: Colors.black},
  overlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  overlayContent: {flex: 1, justifyContent: 'space-around'},
  overlayButtons: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  overlayButtonTitle: {
    color: Colors.grey200,
    fontFamily: 'Poppins-Regular',
    fontSize: wp(4),
  },
});
