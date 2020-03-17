import "react-native-gesture-handler";
import React, { useEffect, useState, useReducer } from "react";
import { AsyncStorage } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import { AppLoading } from "expo";
import * as Font from "expo-font";

import { Login } from "./authorization/login";
import { Signup } from "./authorization/signup";
import { Home } from "./home";

import AuthContext from "./contexts/auth.context";

const Stack = createStackNavigator();

const PoppinsLocation = require("./assets/fonts/Poppins-Regular.ttf");
const JosefinSansLocation = require("./assets/fonts/JosefinSans-Regular.ttf");

function reducer(state, action) {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...state,
        userToken: action.token,
        isLoading: false
      };
    case "SIGN_IN":
      return {
        ...state,
        isSignout: false,
        userToken: action.token,
        loggedIn: true
      };
    case "SIGN_OUT":
      return {
        ...state,
        isSignout: true,
        userToken: null
      };
  }
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const initialState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
    loggedIn: false
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadingFontHandler = async () => {
      await Font.loadAsync({
        "Poppins-Regular": PoppinsLocation,
        "JosefinSans-Regular": JosefinSansLocation
      });
      setIsReady(true);
    };
    loadingFontHandler();
  }, [isReady]);

  const authContext = React.useMemo(
    () => ({
      signIn: async (email, token) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        dispatch({ type: "SIGN_IN", token: token });
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      signUp: async data => {
        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      }
    }),
    []
  );

  if (!isReady) {
    return <AppLoading />;
  } else {
    return (
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <Stack.Navigator>
            {state.userToken && state.loggedIn ? (
              <Stack.Screen
                name="Home"
                component={Home}
                options={{
                  title: "",
                  headerStyle: {
                    backgroundColor: "#020204"
                  },
                  headerLeftContainerStyle: {
                    color: "#FFFFFF"
                  }
                }}
              />
            ) : (
              <React.Fragment>
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{
                    title: "",
                    headerStyle: {
                      backgroundColor: "#020204"
                    },
                    headerTitleStyle: {
                      color: "#ABB4BD"
                    }
                  }}
                />
                <Stack.Screen
                  name="Signup"
                  component={Signup}
                  options={{
                    title: "",
                    headerStyle: {
                      backgroundColor: "#020204"
                    },
                    headerLeftContainerStyle: {
                      color: "#FFFFFF"
                    }
                  }}
                />
              </React.Fragment>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    );
  }
}
