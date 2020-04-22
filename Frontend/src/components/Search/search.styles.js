import {StyleSheet} from 'react-native';
import {Colors} from 'react-native-paper';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  searchAppBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: hp(6.4),
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 0,
  },
  searchBar: {
    padding: 0,
    margin: 0,
    backgroundColor: Colors.grey700,
    borderRadius: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    elevation: 0,
    height: hp(6.4),
  },
  searchInput: {
    margin: 0,
    padding: 0,
    fontSize: wp(4),
    color: Colors.grey200,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 0,
    elevation: 0,
  },
  searchContainer: {
    padding: 0,
  },
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
  listImage: {
    width: wp(12),
    height: hp(6),
  },
  listTitle: {
    width: wp('64%'),
    flex: 1,
    fontSize: wp(4),
    color: Colors.grey200,
  },
  listContainer: {
    backgroundColor: Colors.grey900,
    borderWidth: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  listSubtitle: {
    width: wp(58),
    flex: 1,
    color: Colors.grey200,
    fontSize: wp(3),
  },
  listVerticalButton: {
    alignItems: 'flex-end',
    margin: 0,
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
  searchOverlay: {
    flex: 1,
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  searchOverlayContainer: {
    // flex: 1,
    opacity: 1,
    backgroundColor: 'transparent',
    height: hp(8),
  },
});
