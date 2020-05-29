import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'react-native-elements';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Colors} from 'react-native-paper';

console.disableYellowBox = true;

import {Entry} from './src/components/Entry';
import {Sso} from './src/components/Authorization/Sso';
import {Login} from './src/components/Authorization/Login';
import {Signup} from './src/components/Authorization/Signup';
import {ForgotPassword} from './src/components/Authorization/ForgotPassword';
import {ChangePassword} from './src/components/Authorization/ChangePassword';
import {EnterOTP} from './src/components/Authorization/CheckOTP';
import {Loader} from './src/components/Loader';

import {AuthProvider, useAuthContext} from './src/contexts/auth.context';

const Stack = createStackNavigator();

const theme = {
  Text: {
    style: {
      color: Colors.grey200,
    },
  },
};

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const {authState} = useAuthContext();

  return (
    <ThemeProvider theme={theme}>
      <StatusBar backgroundColor={'#121212'} />
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          {!isLoaded && !authState.isSignout ? (
            <Stack.Screen name="Load">
              {props => <Loader {...props} setIsLoaded={setIsLoaded} />}
            </Stack.Screen>
          ) : authState.authToken && authState.loggedIn ? (
            <Stack.Screen name="Entry" component={Entry} />
          ) : (
            <React.Fragment>
              <Stack.Screen name="Sso" component={Sso} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
              <Stack.Screen name="EnterOTP" component={EnterOTP} />
              <Stack.Screen name="ChangePassword" component={ChangePassword} />
            </React.Fragment>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
