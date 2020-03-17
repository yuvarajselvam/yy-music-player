import { StyleSheet } from "react-native";
import Constants from "expo-constants";

export const styles = StyleSheet.create({
  main: {
    // flex: 1,
    flexGrow: 1,
    backgroundColor: "#020204"
    // alignItems: "center",
    // justifyContent: "space-between",
    // padding: 12,
    // marginTop: Constants.statusBarHeight
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 12
  },
  appName: {
    fontFamily: "Poppins-Regular",
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 1
  },
  socialLoginContainer: {
    flexDirection: "row",
    backgroundColor: "#020204",
    alignItems: "flex-start",
    marginTop: 12
  },
  socialLoginButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    width: 145,
    margin: 12
    // marginTop: 28
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
    justifyContent: "center",
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
  }
});
