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
    backgroundColor: Colors.grey800,
    borderRadius: 0,
    borderBottomWidth: 0,
    elevation: 0,
  },
  searchInput: {
    margin: 0,
    fontSize: wp(4),
    height: hp(6.8),
    color: '#E0E0E0',
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
    backgroundColor: '#000000',
  },
  listImage: {
    width: wp(12),
    height: hp(6),
  },
  listTitle: {
    width: wp(58),
    fontSize: wp(4),
    color: '#E0E0E0',
  },
  listContainer: {
    backgroundColor: '#000000',
    borderColor: 'transparent',
  },
  listRightSubtitle: {color: '#E0E0E0', fontSize: wp(3.2)},
  listSubtitle: {color: '#EEEEEE'},
});
