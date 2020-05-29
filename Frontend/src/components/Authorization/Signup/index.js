import React, {useReducer} from 'react';
import {
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  View,
  Platform,
} from 'react-native';
import {Button, Image, Text} from 'react-native-elements';

import {InputBox} from '../../../widgets/InputBox';

import {styles} from '../auth.styles';
import {authService} from '../../../services/auth.service';

const initialState = {};

const reducer = (user, action) => {
  switch (action.type) {
    case 'Name':
      return {...user, name: action.value};
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

  const setInputValue = (val, inputType) => {
    dispatch({type: inputType, value: val});
  };

  const handleSubmit = () => {
    console.log(state);
    if (Object.keys(state).length < 5) {
      Alert.alert('Please fill in all the details');
      return;
    }
    if (state.password === state.confirmPassword) {
      let data = {
        email: state.email,
        name: state.name,
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
      behavior={Platform.OS === 'ios' && 'padding'}
      enabled
      keyboardVerticalOffset="200">
      <ScrollView>
        <View style={styles.signupContainer}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.signupLogo}
          />
          <Text style={styles.signupHeading}>SIGN UP</Text>
          <InputBox
            label="Name"
            type="text"
            value={state.name}
            onChangeText={value => setInputValue(value, 'Name')}
          />
          <InputBox
            label="Email"
            type="email"
            value={state.email}
            onChangeText={value => setInputValue(value, 'Email')}
          />
          <InputBox
            label="Phone Number"
            type="phone"
            value={state.phone}
            onChangeText={value => setInputValue(value, 'PhoneNumber')}
          />
          <InputBox
            label="Password"
            type="password"
            value={state.password}
            onChangeText={value => setInputValue(value, 'Password')}
          />
          <InputBox
            label="Confirm Password"
            type="password"
            value={state.confirmPassword}
            onChangeText={value => setInputValue(value, 'ConfirmPassword')}
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
