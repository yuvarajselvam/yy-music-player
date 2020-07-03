import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  //   heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Colors} from 'react-native-paper';

export const styles = StyleSheet.create({
  selectedMembersContainer: {
    width: wp('100%'),
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.grey600,
    borderTopWidth: 0.2,
    borderTopColor: Colors.grey600,
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(2),
  },
});
