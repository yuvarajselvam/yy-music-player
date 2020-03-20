import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Input, Button, Image, Text } from "react-native-elements";

import { authService } from "../../utils/auth.service";
import { setLocalStore } from "../../utils/funtions";
import { styles } from "../auth.styles";

export function ForgotPassword({ navigation }) {
  const [recoveryEmail, setrecoveryEmail] = useState("");

  const handleOTP = () => {
    let data = {
      email: recoveryEmail
    };
    authService
      .forgotPassword(data)
      .then(async response => {
        console.log(await response.json());
        if (response.status === 200) {
          let localData = { email: recoveryEmail };
          await setLocalStore(localData);
          navigation.navigate({ name: "EnterOTP" });
          setrecoveryEmail("");
        }
      })
      .catch(error => {
        Alert.alert(error.message);
      });
  };

  return (
    <View style={styles.main}>
      <View style={styles.forgotPasswordContainer}>
        <Image
          source={require("../../assets/logo6.png")}
          style={styles.signupLogo}
        />
        <Text style={styles.signupHeading}>FORGOT PASSWORD</Text>
        <Input
          labelStyle={styles.inputLabel}
          containerStyle={styles.inputBoxContainer}
          inputStyle={styles.inputText}
          label="Email"
          textContentType="emailAddress"
          autoCapitalize="none"
          value={recoveryEmail}
          onChangeText={setrecoveryEmail}
          keyboardType="email-address"
        />
        <Button
          raised
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          title="Get OTP"
          onPress={handleOTP}
        />
      </View>
    </View>
  );
}
