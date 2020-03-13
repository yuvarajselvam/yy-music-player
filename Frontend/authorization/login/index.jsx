import React, { useState } from "react";
import { KeyboardAvoidingView, View, Alert } from "react-native";
import { Input, Button, SocialIcon } from "react-native-elements";
import { logInAsync } from "expo-google-app-auth";
import { initializeAsync, logInWithReadPermissionsAsync } from "expo-facebook";
// import Icon from "react-native-vector-icons/MaterialIcons";

import { styles } from "../signup/signup.styles";

export function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInWithGoogleAsync = async () => {
    try {
      const result = await logInAsync({
        androidClientId:
          "156841541425-lc9o7vpqv3p75n60ncetlh8er8p93jhn.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });

      if (result.type === "success") {
        console.log(result);
        Alert.alert("Google signin success", JSON.stringify(result.user));
      } else {
        Alert.alert("Cancelled.");
      }
    } catch (e) {
      Alert.alert(e);
    }
  };

  const signInWithFacebookAsync = async () => {
    try {
      await initializeAsync("2631003830479256");
      const result = await logInWithReadPermissionsAsync();
      if (result.type === "success") {
        console.log(result);
        const response = await fetch(
          `https://graph.facebook.com/me?fields=id,name,email&access_token=${result.token}`
        );
        Alert.alert(
          "Facebook signin success",
          JSON.stringify(await response.json())
        );
      } else {
        Alert.alert("Cancelled.");
      }
    } catch ({ message }) {
      Alert.alert(`Facebook Login Error: ${message}`);
    }
  };

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
      <View style={styles.rowContainer}>
        <SocialIcon type="google" raised onPress={signInWithGoogleAsync} />
        <SocialIcon type="facebook" raised onPress={signInWithFacebookAsync} />
      </View>
    </KeyboardAvoidingView>
  );
}
