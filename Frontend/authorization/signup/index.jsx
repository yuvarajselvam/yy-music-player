import React, { useReducer } from "react";
import {
  TextInput,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity
} from "react-native";

import { styles } from "./signup.styles";

const user = { country: "India" };

const reducer = (user, action) => {
  switch (action.type) {
    case "FullName":
      return { ...user, fullName: action.value };
    case "Email":
      return { ...user, email: action.value };
    case "PhoneNumber":
      return { ...user, phone: action.value };
    case "Password":
      return { ...user, password: action.value };
    case "ConfirmPassword":
      return { ...user, confirmPassword: action.value };
    default:
      return {};
  }
};

export function Signup() {
  const [state, dispatch] = useReducer(reducer, user);

  const setFullName = val => {
    dispatch({ type: "FullName", value: val });
  };

  const setEmail = val => {
    dispatch({ type: "Email", value: val });
  };

  const setPhoneNumber = val => {
    dispatch({ type: "PhoneNumber", value: val });
  };

  const setPassword = val => {
    dispatch({ type: "Password", value: val });
  };

  const setConfirmPassword = val => {
    dispatch({ type: "ConfirmPassword", value: val });
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
    //     confirmPassword: state.confirmPassword,
    //     email: state.email,
    //     fullName: state.firstName,
    //     password: state.password,
    //     phone: state.phone
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
      {/* <View>
        <Text style={styles.signupHeading}>Signup</Text>
      </View> */}
      <View style={styles.textBox}>
        <TextInput
          placeholder="Full Name"
          returnKeyType={"next"}
          blurOnSubmit={false}
          maxLength={30}
          textContentType="namePrefix"
          value={state.fullName}
          onChangeText={setFullName}
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
      <View style={styles.textBox}>
        <TextInput
          placeholder="Confirm Password"
          autoCapitalize="none"
          textContentType="password"
          secureTextEntry={true}
          value={state.confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <TouchableOpacity onPress={submitAndClear} style={styles.button}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
