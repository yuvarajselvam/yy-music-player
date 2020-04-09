import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  //   main: {
  //     flex: 1,
  //     flexDirection: 'column',
  //     backgroundColor: '#020204',
  //     justifyContent: 'flex-start',
  //   },

  entryContainer: {
    alignItems: 'center',
  },

  entrySignUpContainer: {
    flexDirection: 'row',
    margin: hp(2),
    alignItems: 'center',
  },

  dontHaveAccount: {
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    fontSize: wp(3.4),
  },

  socialMain: {
    flexGrow: 1,
    backgroundColor: '#020204',
    justifyContent: 'center',
  },

  socialLoginContainer: {
    justifyContent: 'center',
    width: wp(74),
    marginBottom: hp(2.8),
  },

  facebookButton: {
    height: hp(6.4),
    borderRadius: wp(8),
    backgroundColor: '#3b5998',
    justifyContent: 'flex-start',
  },

  googleButton: {
    height: hp(6.4),
    borderRadius: wp(8),
    backgroundColor: '#DB4437',
    justifyContent: 'flex-start',
  },

  emailButton: {
    height: hp(6.4),
    borderRadius: wp(8),
    backgroundColor: '#FF1654',
    justifyContent: 'flex-start',
  },

  socialIcon: {
    alignSelf: 'center',
    marginLeft: wp(6),
    width: wp(6),
  },

  socialButtonTitle: {
    fontFamily: 'Poppins-Regular',
    lineHeight: hp(2.2),
    // fontWeight: "100",
    fontSize: hp(2),
    alignSelf: 'center',
    marginLeft: wp(6),
  },

  logoImage: {
    width: wp(34),
    height: hp(20),
    marginBottom: hp(2),
  },

  signUpButtonTitle: {
    fontFamily: 'Poppins-Regular',
    color: '#00FFFF',
    fontSize: wp(3.4),
  },

  loadingIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
