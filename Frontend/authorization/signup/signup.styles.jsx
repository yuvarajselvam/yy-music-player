import { StyleSheet } from "react-native";
// import Constants from "expo-constants";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020204",
    alignItems: "center",
    padding: 12
    // marginTop: Constants.statusBarHeight
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#020204",
    alignItems: "flex-start",
    padding: 28
    // marginTop: Constants.statusBarHeight
  },
  leftIcons: {
    justifyContent: "center",
    alignSelf: "flex-start"
    // alignContent: "flex-start",
    // alignItems: "flex-start"
  },
  inputBox: {
    padding: 12,
    margin: 0
  },
  inputLabel: {
    fontFamily: "Poppins-Regular",
    fontWeight: "normal",
    color: "#ABB4BD"
  },
  button: {
    justifyContent: "center",
    height: 50,
    backgroundColor: "#FF1654"
  },
  buttonContainer: {
    height: 50,
    backgroundColor: "#64B5F6",
    borderRadius: 5,
    width: "90%",
    margin: 10
  },
  buttonTitle: {
    fontFamily: "Poppins-Regular"
  }
});
