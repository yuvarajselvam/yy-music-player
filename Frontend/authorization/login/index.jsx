import React, { useState, useContext } from "react";
import { View } from "react-native";
import { Input, Button, Image, Text } from "react-native-elements";

import { authService } from "../../utils/auth.service";
import AuthContext from "../../contexts/auth.context";
import { styles } from "../auth.styles";

export function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext);

  const signInWithEmail = () => {
    let data = {
      email: email,
      password: password
    };
    authService
      .userSignIn(data)
      .then(async response => {
        let responseObj = await response.json();
        signIn(email, responseObj.token);
        setEmail("");
        setPassword("");
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.main}>
      <View style={styles.loginContainer}>
        <Image
          source={require("../../assets/logo6.png")}
          style={styles.logoImage}
        />
        <Text style={styles.appName}>WePlay</Text>
        <Input
          containerStyle={styles.inputBoxContainer}
          labelStyle={styles.inputLabel}
          inputStyle={styles.inputText}
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
          containerStyle={styles.inputBoxContainer}
          inputStyle={styles.inputText}
          autoCapitalize="none"
          textContentType="password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <Button
          title="Forgot password?"
          containerStyle={styles.forgotContainer}
          titleStyle={styles.forgotContainerText}
          type="clear"
          onPress={() => navigation.navigate("ForgotPassword")}
        />
        <Button
          raised
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          title="Login"
          onPress={signInWithEmail}
        />
        <View style={styles.socialLoginContainer}></View>
      </View>
    </View>
  );
}
