import {StyleSheet} from 'react-native';
import {Colors} from 'react-native-paper';
import {
  //   heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    padding: 0,
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: Colors.grey900,
  },
  listContainer: {
    // padding: 0,
    // paddingLeft: 12,
    // // paddingRight: 4,
    backgroundColor: Colors.grey900,
    borderWidth: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,
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
    color: Colors.grey300,
    fontFamily: 'Poppins-Regular',
    fontSize: wp(4),
  },
  playlistScope: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
