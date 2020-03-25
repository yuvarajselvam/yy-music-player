import 'react-native-gesture-handler';
import React, {useReducer} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Entry} from './src/authorization/entry';
import {Login} from './src/authorization/login';
import {Signup} from './src/authorization/signup';
import {ForgotPassword} from './src/authorization/forgotPassword';
import {ChangePassword} from './src/authorization/changePassword';
import {EnterOTP} from './src/authorization/checkOTP';
import {Home} from './src/home';

import AuthContext from './src/contexts/auth.context';

const Stack = createStackNavigator();

function reducer(state, action) {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        userToken: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...state,
        isSignout: false,
        userToken: action.token,
        loggedIn: true,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isSignout: true,
        userToken: null,
      };
  }
}

export default function App() {
  const initialState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
    loggedIn: false,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const authContext = React.useMemo(
    () => ({
      signIn: async (email, token) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        dispatch({type: 'SIGN_IN', token: token});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async data => {
        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator headerMode="screen">
          {state.userToken && state.loggedIn ? (
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                title: '',
                headerStyle: {
                  backgroundColor: '#020204',
                },
                headerLeftContainerStyle: {
                  color: '#FFFFFF',
                },
              }}
            />
          ) : (
            <React.Fragment>
              <Stack.Screen
                name="Entry"
                component={Entry}
                options={{
                  title: '',
                  headerStyle: {
                    backgroundColor: '#020204',
                  },
                  headerTitleStyle: {
                    color: '#ABB4BD',
                  },
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{
                  title: '',
                  headerStyle: {
                    backgroundColor: '#020204',
                  },
                  headerTitleStyle: {
                    color: '#ABB4BD',
                  },
                }}
              />
              <Stack.Screen
                name="Signup"
                component={Signup}
                options={{
                  title: '',
                  headerStyle: {
                    backgroundColor: '#020204',
                  },
                  headerLeftContainerStyle: {
                    color: '#FFFFFF',
                  },
                }}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{
                  title: '',
                  headerStyle: {
                    backgroundColor: '#020204',
                  },
                  headerLeftContainerStyle: {
                    color: '#FFFFFF',
                  },
                }}
              />
              <Stack.Screen
                name="EnterOTP"
                component={EnterOTP}
                options={{
                  title: '',
                  headerStyle: {
                    backgroundColor: '#020204',
                  },
                  headerLeftContainerStyle: {
                    color: '#FFFFFF',
                  },
                }}
              />
              <Stack.Screen
                name="ChangePassword"
                component={ChangePassword}
                options={{
                  title: '',
                  headerStyle: {
                    backgroundColor: '#020204',
                  },
                  headerLeftContainerStyle: {
                    color: '#FFFFFF',
                  },
                }}
              />
            </React.Fragment>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
