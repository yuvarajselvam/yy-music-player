import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // alignContent: 'center',
    margin: 0,
    backgroundColor: '#121212',
    borderWidth: 0,
  },
  cardWrapper: {justifyContent: 'space-evenly', alignItems: 'center'},
  listContainer: {
    backgroundColor: '#121212',
    margin: 0,
    borderWidth: 0,
  },
  rightIconContainer: {flexDirection: 'row', alignItems: 'center'},
});
