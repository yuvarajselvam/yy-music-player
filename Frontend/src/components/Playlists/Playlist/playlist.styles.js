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
    backgroundColor: '#121212',
    borderBottomWidth: 0,
  },
  overlayContainer: {flex: 1, opacity: 0.7, backgroundColor: Colors.black},
  overlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
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
  selectedFollowersContainer: {
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
