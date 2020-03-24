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
  entryContainer: {
    alignItems: 'center',
  },
  loginContainer: {
    // paddingBottom: hp(8),
    alignItems: 'center',
    margin: wp(1),
  },
  signupContainer: {
    // paddingBottom: hp(4),
    alignItems: 'center',
    margin: wp(1),
  },
  signupHeading: {
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    fontSize: hp(2.8),
    marginBottom: hp(2),
  },
  entrySignUpContainer: {
    flexDirection: 'row',
    margin: hp(2),
    alignItems: 'center',
  },
  dontHaveAccount: {
    color: '#FFFFFF',
    fontSize: wp(3.4),
  },
  signUpButtonTitle: {
    color: '#00FFFF',
    fontSize: wp(3.4),
  },
  forgotPasswordContainer: {
    alignItems: 'center',
  },
  checkOTPContainer: {
    alignItems: 'center',
  },
  changePasswordContainer: {
    alignItems: 'center',
  },
  appName: {
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 1,
  },
  socialMain: {
    flexGrow: 1,
    backgroundColor: '#020204',
    justifyContent: 'center',
  },
  socialLoginContainer: {
    width: wp(74),
    marginBottom: hp(2.8),
  },
  facebookButton: {
    height: hp(6.4),
    borderRadius: wp(4),
    backgroundColor: '#3b5998',
    justifyContent: 'flex-start',
  },
  googleButton: {
    height: hp(6.4),
    borderRadius: wp(4),
    backgroundColor: '#DB4437',
    justifyContent: 'flex-start',
  },
  emailButton: {
    height: hp(6.4),
    borderRadius: wp(4),
    backgroundColor: '#FF1654',
    justifyContent: 'flex-start',
  },
  iconContainStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    alignSelf: 'center',
    marginLeft: wp(4),
    width: wp(8),
  },
  socialLoginFont: {
    textAlign: 'center',
    color: '#000000',
  },
  leftIcons: {
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
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
  button: {
    borderRadius: wp(8),
    backgroundColor: '#FF1654',
  },
  buttonContainer: {
    marginTop: hp(2),
    width: wp(68),
  },
  socialButtonTitle: {
    // fontFamily: "Poppins-Regular",
    // fontWeight: "100",
    fontSize: hp(2),
    marginLeft: wp(4),
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