import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  inputBoxContainer: {
    padding: 0,
    margin: 0,
  },
  inputContainer: {
    padding: 0,
    margin: 0,
  },
  input: {
    padding: 0,
    margin: 0,
    color: '#FFFFFF',
  },

  inputLabel: {
    fontFamily: 'Poppins-Regular',
    fontWeight: 'normal',
    color: '#ABB4BD',
    fontSize: hp(1.6),
  },
});
