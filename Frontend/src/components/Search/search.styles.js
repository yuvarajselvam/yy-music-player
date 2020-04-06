import {StyleSheet} from 'react-native';
import {Colors} from 'react-native-paper';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  searchBar: {
    padding: 0,
    margin: 0,
    backgroundColor: Colors.grey700,
    borderRadius: 0,
    borderBottomWidth: 0,
    elevation: 0,
    height: hp(6.4),
  },
  searchInput: {
    margin: 0,
    padding: 0,
    fontSize: wp(4),
    color: Colors.grey200,
    borderRadius: 0,
    borderBottomWidth: 0,
    elevation: 0,
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
    width: wp(58),
    fontSize: wp(4),
    color: Colors.grey200,
  },
  listContainer: {
    backgroundColor: Colors.grey900,
    borderColor: 'transparent',
  },
  listRightSubtitle: {color: Colors.grey200, fontSize: wp(3.2)},
  listSubtitle: {color: Colors.grey200, fontSize: wp(3.4)},
});
