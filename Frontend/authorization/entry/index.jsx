import React, { useContext } from "react";
import { View, Alert, AsyncStorage } from "react-native";
import { Button, Image, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { logInAsync } from "expo-google-app-auth";
import { initializeAsync, logInWithReadPermissionsAsync } from "expo-facebook";
import { osName } from "expo-device";

import AuthContext from "../../contexts/auth.context";

import { authService } from "../../utils/auth.service";
import { SOCIAL_TYPES } from "../../utils/constants";
import { getLocalStore, setLocalStore } from "../../utils/funtions";

import { styles } from "../auth.styles";

export function Entry({ navigation }) {
  const { signIn } = useContext(AuthContext);

  const initialUserAuthentication = async loginType => {
    let localDataObj = await getLocalStore();
    return new Promise(async (resolve, reject) => {
      if (localDataObj && localDataObj.accessToken) {
        let email = localDataObj.email;
        let type = localDataObj.signInType;
        if (type !== loginType) {
          console.log("Clearing unMatched LoginType localstore");
          await AsyncStorage.removeItem("localStore");
          resolve(true);
        } else {
          let data = {
            email: email,
            type: type,
            os: osName
          };
          authService
            .userSSO(data)
            .then(response => {
              if (response.status === 200) {
                console.log("Intial User Authentication Response");
                signIn(email, localDataObj.accessToken);
                resolve(true);
              } else {
                resolve(false);
              }
            })
            .catch(err => {
              Alert.alert(err.message);
            });
        }
      } else {
        resolve(false);
      }
    });
  };

  const signInWithGoogle = () => {
    initialUserAuthentication(SOCIAL_TYPES.GOOGLE)
      .then(async response => {
        console.log("signInWithFacebook calling!");
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
                email: email,
                os: osName
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
                  email: email,
                  os: osName
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

  const handleSignUp = () => {
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.socialMain}>
      <View style={styles.entryContainer}>
        <Image
          source={require("../../assets/logo6.png")}
          style={styles.logoImage}
        />
        <Button
          icon={
            <View style={styles.iconContainStyle}>
              <Icon
                name="facebook-square"
                type="font-awesome"
                size={26}
                color="white"
                style={styles.socialIcon}
              />
            </View>
          }
          containerStyle={styles.socialLoginContainer}
          buttonStyle={styles.facebookButton}
          titleStyle={styles.socialButtonTitle}
          solid
          title={"Continue with Facebook"}
          onPress={() => signInWithFacebook(SOCIAL_TYPES.FACEBOOK)}
        />
        <Button
          icon={
            <View style={styles.iconContainStyle}>
              <Icon
                name="google"
                type="font-awesome"
                size={26}
                color="white"
                style={styles.socialIcon}
              />
            </View>
          }
          containerStyle={styles.socialLoginContainer}
          buttonStyle={styles.googleButton}
          titleStyle={styles.socialButtonTitle}
          solid
          title={"Continue with Google"}
          onPress={() => signInWithGoogle(SOCIAL_TYPES.GOOGLE)}
        />
        <Button
          icon={
            <View style={styles.iconContainStyle}>
              <Icon
                name="envelope"
                type="font-awesome"
                size={26}
                color="white"
                style={styles.socialIcon}
              />
            </View>
          }
          iconContainerStyle={styles.facebookIcon}
          containerStyle={styles.socialLoginContainer}
          buttonStyle={styles.emailButton}
          titleStyle={styles.socialButtonTitle}
          solid
          title={"Continue with Email"}
          onPress={() => navigation.navigate("Login")}
        />
        <View style={styles.entrySignUpContainer}>
          <Text style={styles.dontHaveAccount}>Don't have an account?</Text>
          <Button
            title="Sign Up"
            titleStyle={styles.signUpButtonTitle}
            type="clear"
            onPress={handleSignUp}
          />
        </View>
      </View>
    </View>
  );
}
