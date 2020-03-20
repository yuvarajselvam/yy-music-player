import React, { useState } from "react";
import { View } from "react-native";
import { Input, Image, Text, Button } from "react-native-elements";

import { styles } from "../auth.styles";
import { authService } from "../../utils/auth.service";
import { getLocalStore } from "../../utils/funtions";

export function ChangePassword({ navigation }) {
  const [newPassword, setnewPassword] = useState("");

  const handlePasswordChange = async () => {
    let localData = await getLocalStore();
    let data = {
      grantType: "forgot_password_token",
      newPassword: newPassword,
      email: localData.email
    };
    authService.changePassword(data).then(response => {
      if (response.status === 200) {
        navigation.navigate("Login");
        setOldPassword("");
        setnewPassword("");
      }
    });
  };

  return (
    <View style={styles.main}>
      <View style={styles.signupContainer}>
        <Image
          source={require("../../assets/logo6.png")}
          style={styles.signupLogo}
        />
        <Text style={styles.signupHeading}>New Password</Text>
        <Input
          labelStyle={styles.inputLabel}
          containerStyle={styles.inputBoxContainer}
          inputStyle={styles.inputText}
          label="Enter password"
          returnKeyType={"next"}
          blurOnSubmit={false}
          textContentType="password"
          secureTextEntry={true}
          value={newPassword}
          onChangeText={setnewPassword}
        />
        <Button
          raised
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          title="Submit OTP"
          onPress={handlePasswordChange}
        />
      </View>
    </View>
  );
}
