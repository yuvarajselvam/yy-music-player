import React, { useReducer } from "react";
import {
  TextInput,
  Picker,
  Text,
  View,
  Button,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity
} from "react-native";
import Constants from "expo-constants";

const user = {};

const reducer = (user, action) => {
  switch (action.type) {
    case "FirstName":
      return { ...user, firstName: action.value };
      break;
    case "LastName":
      return { ...user, lastName: action.value };
      break;
    case "Email":
      return { ...user, email: action.value };
      break;
    case "PhoneNumber":
      return { ...user, phone: action.value };
      break;
    case "Country":
      return { ...user, country: action.value };
      break;
    case "City":
      return { ...user, city: action.value };
      break;
    case "StateName":
      return { ...user, stateName: action.value };
      break;
    case "Password":
      return { ...user, password: action.value };
      break;
    default:
      return {};
      break;
  }
};
export function Login() {
  const [state, dispatch] = useReducer(reducer, user);

  const setFirstName = val => {
    dispatch({ type: "FirstName", value: val });
  };

  const setLastName = val => {
    dispatch({ type: "LastName", value: val });
  };

  const setEmail = val => {
    dispatch({ type: "Email", value: val });
  };

  const setPhoneNumber = val => {
    dispatch({ type: "PhoneNumber", value: val });
  };

  const setCountry = val => {
    dispatch({ type: "Country", value: val });
  };

  const setCity = val => {
    dispatch({ type: "City", value: val });
  };

  const setStateName = val => {
    dispatch({ type: "StateName", value: val });
  };

  const setPassword = val => {
    dispatch({ type: "Password", value: val });
  };

  const submitAndClear = val => {
    console.log(state);
    if (Object.keys(state).length < 8) {
      alert("Please fill all the details");
    } else {
      dispatch({});
    }
    // Push the values to the API Endpoint
    // fetch("http://31b6b1df.ngrok.io/user/create/", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     city: state.city,
    //     country: state.country,
    //     email: state.email,
    //     firstName: state.firstName,
    //     lastName: state.lastName,
    //     password: state.password,
    //     phone: state.phone,
    //     stateName: state.stateName
    //   })
    // }).then(
    //   res => {
    //     console.log(res);
    //     dispatch({});
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View style={styles.textBox}>
        <TextInput
          placeholder="First Name"
          returnKeyType={"next"}
          blurOnSubmit={false}
          autoFocus={true}
          maxLength={30}
          textContentType="namePrefix"
          value={state.firstName}
          onChangeText={setFirstName}
        />
      </View>
      <View style={styles.textBox}>
        <TextInput
          placeholder="Last Name"
          maxLength={30}
          textContentType="nameSuffix"
          value={state.lastName}
          onChangeText={setLastName}
        />
      </View>
      <View style={styles.textBox}>
        <TextInput
          placeholder="Email"
          textContentType="emailAddress"
          autoCapitalize="none"
          value={state.email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.textBox}>
        <TextInput
          placeholder="Phone Number"
          maxLength={10}
          textContentType="telephoneNumber"
          value={state.phone}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.pickerBox}>
        <Picker selectedValue={state.country} onValueChange={setCountry}>
          <Picker.Item label="India" value="india" />
          <Picker.Item label="America" value="america" />
        </Picker>
      </View>
      <View style={styles.textBox}>
        <TextInput placeholder="City" value={state.city} onChangeText={setCity} />
      </View>
      <View style={styles.textBox}>
        <TextInput placeholder="State" value={state.stateName} onChangeText={setStateName} />
      </View>
      <View style={styles.textBox}>
        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          textContentType="password"
          secureTextEntry={true}
          value={state.password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.button}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: Constants.statusBarHeight
  },
  textBox: {
    height: 50,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 4
  },
  pickerBox: {
    height: 50,
    justifyContent: "center",
    width: "100%",
    margin: 10,
    borderColor: "gray",
    borderWidth: 1,
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
