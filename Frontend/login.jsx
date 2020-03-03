import React, { useReducer } from "react";
import { TextInput, Text, View, Button, Platform, StyleSheet, KeyboardAvoidingView } from "react-native";
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
    <View style={styles.container}>
      <TextInput
        placeholder="First Name"
        style={{ height: 40 }}
        autoFocus={true}
        maxLength={30}
        textContentType="namePrefix"
        value={state.firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={{ height: 40 }}
        placeholder="Last Name"
        maxLength={30}
        textContentType="nameSuffix"
        value={state.lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={{ height: 40 }}
        placeholder="Email"
        textContentType="emailAddress"
        autoCapitalize="none"
        value={state.email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={{ height: 40 }}
        placeholder="Phone Number"
        maxLength={10}
        textContentType="telephoneNumber"
        value={state.phone}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput style={{ height: 40 }} placeholder="Country" value={state.country} onChangeText={setCountry} />
      <TextInput style={{ height: 40 }} placeholder="City" value={state.city} onChangeText={setCity} />
      <TextInput style={{ height: 40 }} placeholder="State" value={state.stateName} onChangeText={setStateName} />
      <TextInput
        style={{ height: 40 }}
        placeholder="Password"
        autoCapitalize="none"
        textContentType="password"
        secureTextEntry={true}
        value={state.password}
        onChangeText={setPassword}
      />
      <Button title="Submit" onPress={submitAndClear} style={styles.button}></Button>
    </View>
  );
}

const styles =
  Platform.OS === "android"
    ? StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
          marginTop: Constants.statusBarHeight
        },
        button: {
          marginTop: 20,
          // width: "50%",
          alignSelf: "center",
          justifyContent: "center"
        }
      })
    : StyleSheet.create({
        button: {
          marginTop: 20,
          width: "50%",
          alignSelf: "center",
          justifyContent: "center"
        }
      });