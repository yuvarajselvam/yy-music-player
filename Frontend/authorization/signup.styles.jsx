import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
  main: {
    // flex: 1,
    flexGrow: 1,
    backgroundColor: "#020204"
    // justifyContent: "center"
    // marginTop: Constants.statusBarHeight
  },
  socialMain: {
    // flex: 1,
    flexGrow: 1,
    backgroundColor: "#020204",
    justifyContent: "center"
    // marginTop: Constants.statusBarHeight
  },
  container: {
    alignItems: "center"
  },
  appName: {
    fontFamily: "Poppins-Regular",
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 1
  },
  socialLoginContainer: {
    width: wp(74),
    marginBottom: hp(2.8)
  },
  facebookButton: {
    height: hp(6.4),
    borderRadius: wp(4),
    backgroundColor: "#3b5998",
    justifyContent: "flex-start"
  },
  googleButton: {
    height: hp(6.4),
    borderRadius: wp(4),
    backgroundColor: "#DB4437",
    justifyContent: "flex-start"
  },
  emailButton: {
    height: hp(6.4),
    borderRadius: wp(4),
    backgroundColor: "#FF1654",
    justifyContent: "flex-start"
  },
  iconContainStyle: {
    alignSelf: "center",
    justifyContent: "center"
    // marginLeft: wp(8)
  },
  socialIcon: {
    alignSelf: "center",
    // backgroundColor: "#000000",
    marginLeft: wp(4),
    width: wp(8)
  },

  socialLoginFont: {
    textAlign: "center",
    color: "#000000"
  },
  leftIcons: {
    justifyContent: "center",
    alignSelf: "flex-start"
  },
  inputBox: {
    padding: 16,
    margin: 0
  },
  inputText: {
    color: "#FFFFFF"
  },
  inputLabel: {
    fontFamily: "Poppins-Regular",
    fontWeight: "normal",
    color: "#ABB4BD",
    fontSize: 12
  },
  button: {
    height: 46,
    backgroundColor: "#FF1654"
  },
  buttonContainer: {
    height: 46,
    backgroundColor: "#64B5F6",
    borderRadius: 5,
    width: "90%",
    margin: 12
  },
  socialButtonTitle: {
    fontFamily: "Poppins-Regular",
    fontSize: hp(2),
    marginLeft: wp(4)
    // justifyContent: "flex-start",
  },
  buttonTitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14
  },
  forgotContainer: {
    alignSelf: "flex-end"
  },
  forgotContainerText: {
    color: "#FF1654",
    fontSize: 12
  },
  logoImage: { width: wp(40), height: hp(24), marginBottom: hp(4) }
});
