import React, { useState, useContext } from "react";
import { KeyboardAvoidingView, View, Alert, AsyncStorage } from "react-native";
import { Input, Button, SocialIcon, Image, Text } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { logInAsync } from "expo-google-app-auth";
import { initializeAsync, logInWithReadPermissionsAsync } from "expo-facebook";

import { authService } from "../../utils/auth.service";
import { SOCIAL_TYPES } from "../../utils/constants";
import AuthContext from "../../contexts/auth.context";
import { styles } from "../signup.styles";

const getLocalStore = async () => {
  let data = await AsyncStorage.getItem("localStore");
  let dataObj = JSON.parse(data);
  return dataObj;
};

const setLocalStore = async obj => {
  await AsyncStorage.setItem("localStore", JSON.stringify(obj));
};

export function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext);

  const initialUserAuthentication = async loginType => {
    // console.log("initialUserAuthentication === ", await getLocalStore());
    localDataObj = await getLocalStore();
    return new Promise(async (resolve, reject) => {
      if (localDataObj && localDataObj.accessToken) {
        let email = localDataObj.email;
        let type = localDataObj.signInType;
        if (type !== loginType) {
          console.log("Clearing diff local SSO store");
          await AsyncStorage.removeItem("localStore");
          resolve("Success");
        }
        let data = {
          email: email,
          type: type
        };
        authService
          .userSSO(data)
          .then(response => {
            if (response.status === 200) {
              console.log("intialUserauth Response");
              signIn(email, localDataObj.accessToken);
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch(err => {
            Alert.alert(err.message);
          });
      } else {
        resolve(false);
      }
    });
  };

  const signInWithGoogle = () => {
    initialUserAuthentication(SOCIAL_TYPES.GOOGLE)
      .then(async response => {
        console.log("isAuthorizesUsser===", response);
        if (!response) {
          console.log("is google auth===");
          try {
            const result = await logInAsync({
              androidClientId:
                "156841541425-lc9o7vpqv3p75n60ncetlh8er8p93jhn.apps.googleusercontent.com",
              iosClientId:
                "156841541425-5iehdba23m6iejp3bbi40b5d2dfr7emn.apps.googleusercontent.com",
              scopes: ["profile", "email"]
            });

            if (result.type === "success") {
              let name = result.user.name;
              let email = result.user.email;
              let id = result.user.id;
              let accessToken = result.accessToken;
              let refreshToken = result.refreshToken;
              let data = {
                type: "google",
                accessToken: accessToken,
                refreshToken: refreshToken,
                id: id,
                fullName: name,
                email: email
              };
              authentiateUser(data);
            } else {
              Alert.alert("Failed!");
            }
          } catch (e) {
            Alert.alert(e);
          }
        }
      })
      .catch(error => {
        Alert.alert(error.message);
      });
  };

  const signInWithFacebook = () => {
    initialUserAuthentication(SOCIAL_TYPES.FACEBOOK).then(async response => {
      console.log("signInWithFacebook calling!");
      if (!response) {
        console.log("is auth===");
        try {
          await initializeAsync("239049343807413");
          const result = await logInWithReadPermissionsAsync();
          if (result.type === "success") {
            fetch(
              `https://graph.facebook.com/me?fields=id,name,email&access_token=${result.token}`
            ).then(response => {
              response.json().then(userResult => {
                let name = userResult.name;
                let email = userResult.email;
                let accessToken = result.token;
                let id = userResult.id;
                let data = {
                  type: "facebook",
                  accessToken: accessToken,
                  id: id,
                  fullName: name,
                  email: email
                };
                authentiateUser(data);
              });
            });
          } else {
            Alert.alert("Failed!");
          }
        } catch (e) {
          Alert.alert(e);
        }
      }
    });
  };

  const authentiateUser = data => {
    authService
      .userSSO(data)
      .then(async response => {
        console.log("authenticateUser calling ===", await response.json());
        if (response.status === 200 || response.status === 201) {
          let localData = {
            email: data.email,
            accessToken: data.accessToken,
            signInType: data.type
          };
          // console.log("aunthenticate user", localData);
          await setLocalStore(localData);
          signIn(data.email, data.accessToken);
        }
      })
      .catch(err => {
        console.log(err.message);
        Alert.alert("Failed!", err.message);
      });
  };

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
    <ScrollView
      automaticallyAdjustContentInsets={true}
      contentContainerStyle={styles.main}
    >
      <KeyboardAvoidingView style={styles.container}>
        <Image
          source={require("../../assets/logo6.png")}
          style={{ width: 160, height: 160 }}
        />
        <Text style={styles.appName}>WePlay</Text>
        <Input
          containerStyle={styles.inputBox}
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
          containerStyle={styles.inputBox}
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
        <Button
          raised
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          title="Signup"
          onPress={() => navigation.navigate("Signup")}
        />
        <View style={styles.socialLoginContainer}>
          <SocialIcon
            style={styles.socialLoginButton}
            fontStyle={styles.socialLoginFont}
            iconColor={"#475993"}
            type={SOCIAL_TYPES.FACEBOOK}
            button
            title={"Facebook"}
            onPress={() => signInWithFacebook(SOCIAL_TYPES.FACEBOOK)}
          />
          <SocialIcon
            style={styles.socialLoginButton}
            fontStyle={styles.socialLoginFont}
            iconColor={"#DB4437"}
            type={SOCIAL_TYPES.GOOGLE}
            button
            title={"Google"}
            onPress={() => signInWithGoogle(SOCIAL_TYPES.GOOGLE)}
          />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
