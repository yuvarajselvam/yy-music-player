import {StyleSheet} from 'react-native';
import {Colors} from 'react-native-paper';
import {
  //   heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  text: {
    flex: 1,
    color: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  listContainer: {
    padding: 0,
    paddingLeft: 12,
    paddingRight: 4,
    backgroundColor: '#121212',
    borderBottomWidth: 0,
  },
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
