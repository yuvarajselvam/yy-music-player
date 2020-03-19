import React, { useContext } from "react";
import { View, Alert, AsyncStorage } from "react-native";
import { Button, Image, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { logInAsync } from "expo-google-app-auth";
import { initializeAsync, logInWithReadPermissionsAsync } from "expo-facebook";

import {
  widthPercentageToDP,
  heightPercentageToDP
} from "react-native-responsive-screen";
import { authService } from "../../utils/auth.service";
import AuthContext from "../../contexts/auth.context";

import { SOCIAL_TYPES } from "../../utils/constants";
import { styles } from "../auth.styles";

const getLocalStore = async () => {
  let data = await AsyncStorage.getItem("localStore");
  let dataObj = JSON.parse(data);
  return dataObj;
};

const setLocalStore = async obj => {
  await AsyncStorage.setItem("localStore", JSON.stringify(obj));
};

export function Entry({ navigation }) {
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
        <View
          style={{
            flexDirection: "row",
            margin: heightPercentageToDP(2),
            alignItems: "center"
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: widthPercentageToDP(3) }}>
            Don't have an account?
          </Text>
          <Button
            title="Sign Up"
            titleStyle={{ color: "#00FFFF", fontSize: widthPercentageToDP(3) }}
            type="clear"
            onPress={() => navigation.navigate("Signup")}
          />
        </View>
      </View>
    </View>
  );
}
