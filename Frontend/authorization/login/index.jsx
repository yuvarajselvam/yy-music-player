import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

import { styles } from "../signup/signup.styles";

export function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginAndClear = () => {
    console.log("Logining In and clear");
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.textBox}>
        <TextInput
          placeholder="Email"
          textContentType="emailAddress"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.textBox}>
        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          textContentType="password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity onPress={loginAndClear} style={styles.button}>
        <Text>Login</Text>
      </TouchableOpacity>
      <View>
        <Text onPress={() => navigation.navigate("Signup")}>Signup</Text>
      </View>
    </KeyboardAvoidingView>
  );
}
