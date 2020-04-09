import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#020204',
    justifyContent: 'flex-start',
  },

  loginContainer: {
    paddingBottom: hp(2),
    alignItems: 'center',
    margin: wp(1),
  },

  signupContainer: {
    paddingBottom: hp(2),
    alignItems: 'center',
    margin: wp(1),
  },

  signupHeading: {
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    fontSize: hp(2.8),
    marginBottom: hp(2),
  },

  forgotPasswordContainer: {
    alignItems: 'center',
    paddingBottom: hp(2),
    margin: wp(1),
  },

  checkOTPContainer: {
    alignItems: 'center',
    paddingBottom: hp(2),
    margin: wp(1),
  },

  changePasswordContainer: {
    alignItems: 'center',
    paddingBottom: hp(2),
    margin: wp(1),
  },

  appName: {
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 1,
  },

  leftIcons: {
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },

  button: {
    borderRadius: wp(8),
    backgroundColor: '#FF1654',
  },

  buttonContainer: {
    marginTop: hp(2),
    width: wp(68),
  },

  buttonTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp(2),
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: hp(2),
  },
  forgotContainerText: {
    color: '#FF1654',
    fontFamily: 'Poppins-Regular',
    fontSize: hp(1.6),
  },
  logoImage: {
    width: wp(34),
    height: hp(20),
    marginBottom: hp(2),
  },

  signupLogo: {
    width: wp(24),
    height: hp(14),
    marginBottom: hp(1),
  },
});
