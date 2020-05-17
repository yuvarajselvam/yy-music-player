import React, {useState, useContext} from 'react';
import {
  View,
  ToastAndroid,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {Button, Image, Text} from 'react-native-elements';

import {InputBox} from '../../../widgets/InputBox';
import {authService} from '../../../services/auth.service';
import AuthContext from '../../../contexts/auth.context';
import {styles} from '../auth.styles';

export function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {signIn} = useContext(AuthContext);

  const signInWithEmail = () => {
    let data = {
      email: email,
      password: password,
    };
    authService
      .userSignIn(data)
      .then(async response => {
        let responseObj = await response.json();
        if (response.status === 200) {
          signIn(email, responseObj.token);
          setEmail('');
          setPassword('');
        }
        let message = responseObj.message;
        ToastAndroid.show(message, ToastAndroid.LONG);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <KeyboardAvoidingView enabled style={styles.main}>
      <ScrollView>
        <View style={styles.loginContainer}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logoImage}
          />
          <Text style={styles.appName}>WePlay</Text>
          <InputBox
            label="Email"
            type="email"
            value={email}
            onChangeText={setEmail}
          />
          <InputBox
            label="Password"
            type="password"
            value={password}
            onChangeText={setPassword}
          />
          <Button
            title="Forgot password?"
            containerStyle={styles.forgotContainer}
            titleStyle={styles.forgotContainerText}
            type="clear"
            onPress={() => navigation.navigate('ForgotPassword')}
          />
          <Button
            raised
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            title="Login"
            onPress={signInWithEmail}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
