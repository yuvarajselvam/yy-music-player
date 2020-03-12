import React, { useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import { Input, Button } from "react-native-elements";
// import Icon from "react-native-vector-icons/MaterialIcons";

import { styles } from "../signup/signup.styles";

export function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginAndClear = () => {
    console.log("Logining In and clear");
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Input
        containerStyle={styles.inputBox}
        labelStyle={styles.inputLabel}
        textContentType="emailAddress"
        autoCapitalize="none"
        value={email}
        label={"Email"}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Input
        label={"Password"}
        labelStyle={styles.inputLabel}
        containerStyle={styles.inputBox}
        autoCapitalize="none"
        textContentType="password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Button
        raised
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
        titleStyle={styles.buttonTitle}
        title="Login"
        onPress={loginAndClear}
      />
      <Button
        raised
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
        titleStyle={styles.buttonTitle}
        title="Signup"
        onPress={() => navigation.navigate("Signup")}
      />
    </KeyboardAvoidingView>
  );
}
