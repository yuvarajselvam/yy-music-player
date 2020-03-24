import React, {useReducer} from 'react';
import {ScrollView, Alert, KeyboardAvoidingView, View} from 'react-native';
import {Input, Button, Image, Text} from 'react-native-elements';

import {styles} from '../auth.styles';
import {authService} from '../../utils/auth.service';

const initialState = {};

const reducer = (user, action) => {
  switch (action.type) {
    case 'FullName':
      return {...user, fullName: action.value};
    case 'Email':
      return {...user, email: action.value};
    case 'PhoneNumber':
      return {...user, phone: action.value};
    case 'Password':
      return {...user, password: action.value};
    case 'ConfirmPassword':
      return {...user, confirmPassword: action.value};
    default:
      return {};
  }
};

export function Signup({navigation}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setFullName = val => {
    dispatch({type: 'FullName', value: val});
  };

  const setEmail = val => {
    dispatch({type: 'Email', value: val});
  };

  const setPhoneNumber = val => {
    dispatch({type: 'PhoneNumber', value: val});
  };

  const setPassword = val => {
    dispatch({type: 'Password', value: val});
  };

  const setConfirmPassword = val => {
    dispatch({type: 'ConfirmPassword', value: val});
  };

  const handleSubmit = val => {
    console.log(state);
    if (Object.keys(state).length < 5) {
      Alert.alert('Please fill in all the details');
      return;
    }
    if (state.password === state.confirmPassword) {
      let data = {
        email: state.email,
        fullName: state.fullName,
        password: state.password,
        phone: state.phone,
      };
      authService
        .userSignup(data)
        .then(response => {
          if (response.status === 201) {
            navigation.navigate('Login');
            dispatch({});
          }
        })
        .catch(error => {
          console.log(error);
          Alert.alert(error.message);
        });
    } else {
      Alert.alert('Password does not match!');
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.main}
      enabled
    >
      <ScrollView>
        <View style={styles.signupContainer}>
          <Image
            source={require('../../assets/logo6.png')}
            style={styles.signupLogo}
          />
          <Text style={styles.signupHeading}>SIGN UP</Text>
          <Input
            labelStyle={styles.inputLabel}
            containerStyle={styles.inputBoxContainer}
            inputStyle={styles.inputText}
            label="Full Name"
            returnKeyType={'next'}
            blurOnSubmit={false}
            maxLength={30}
            textContentType="namePrefix"
            value={state.fullName}
            onChangeText={setFullName}
          />
          <Input
            labelStyle={styles.inputLabel}
            containerStyle={styles.inputBoxContainer}
            inputStyle={styles.inputText}
            label="Email"
            textContentType="emailAddress"
            autoCapitalize="none"
            value={state.email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Input
            labelStyle={styles.inputLabel}
            containerStyle={styles.inputBoxContainer}
            inputStyle={styles.inputText}
            label="Phone Number"
            maxLength={10}
            textContentType="telephoneNumber"
            value={state.phone}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <Input
            labelStyle={styles.inputLabel}
            containerStyle={styles.inputBoxContainer}
            inputStyle={styles.inputText}
            label="Password"
            autoCapitalize="none"
            textContentType="password"
            secureTextEntry={true}
            value={state.password}
            onChangeText={setPassword}
          />
          <Input
            labelStyle={styles.inputLabel}
            containerStyle={styles.inputBoxContainer}
            inputStyle={styles.inputText}
            label="Confirm Password"
            autoCapitalize="none"
            textContentType="password"
            secureTextEntry={true}
            value={state.confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Button
            raised
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            title="Submit"
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
