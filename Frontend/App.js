import 'react-native-gesture-handler';
import React, {useReducer} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Sso} from './src/components/Authorization/Sso';
import {Login} from './src/components/Authorization/Login';
import {Signup} from './src/components/Authorization/Signup';
import {ForgotPassword} from './src/components/Authorization/ForgotPassword';
import {ChangePassword} from './src/components/Authorization/ChangePassword';
import {EnterOTP} from './src/components/Authorization/CheckOTP';
import {Entry} from './src/components/Entry';

import AuthContext from './src/contexts/auth.context';
import {PlayerProvider} from './src/contexts/player.context';

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
      <PlayerProvider>
        <NavigationContainer>
          <Stack.Navigator headerMode="none">
            {/* {state.userToken && state.loggedIn ? ( */}
            <Stack.Screen name="Entry" component={Entry} />
            {/* ) : ( */}
            <React.Fragment>
              <Stack.Screen name="Sso" component={Sso} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
              <Stack.Screen name="EnterOTP" component={EnterOTP} />
              <Stack.Screen name="ChangePassword" component={ChangePassword} />
            </React.Fragment>
            {/* )} */}
          </Stack.Navigator>
        </NavigationContainer>
      </PlayerProvider>
    </AuthContext.Provider>
  );
}
