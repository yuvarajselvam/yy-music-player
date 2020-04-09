import {StyleSheet} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  inputBoxContainer: {
    marginBottom: hp(2),
  },

  inputText: {
    color: '#FFFFFF',
  },

  inputLabel: {
    fontFamily: 'Poppins-Regular',
    fontWeight: 'normal',
    color: '#ABB4BD',
    fontSize: hp(1.6),
  },
});
