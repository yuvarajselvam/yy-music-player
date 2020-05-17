import {StyleSheet} from 'react-native';
import {Colors} from 'react-native-paper';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

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
    backgroundColor: '#121212',
  },
  listContainer: {
    // padding: 0,
    // paddingLeft: 12,
    // // paddingRight: 4,
    backgroundColor: '#121212',
    borderWidth: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  overlayButtons: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  overlayButtonTitle: {
    color: Colors.grey200,
    fontWeight: 'normal',
    fontSize: wp(4),
  },
  playlistScope: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
