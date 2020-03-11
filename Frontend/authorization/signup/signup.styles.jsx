import { StyleSheet } from "react-native";
// import Constants from "expo-constants";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    padding: 20
    // marginTop: Constants.statusBarHeight
  },
  // signupHeading: {
  //   fontSize: 24,
  //   padding: 12
  // },
  textBox: {
    height: 50,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 4
  },
  button: {
    flexDirection: "row",
    width: "90%",
    height: 50,
    margin: 10,
    backgroundColor: "#64B5F6",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: 5,
    borderWidth: 1
  }
});
