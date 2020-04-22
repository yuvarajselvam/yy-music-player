import React from 'react';
import {Input} from 'react-native-elements';

import {styles} from './input.styles';

export function InputBox(props) {
  let inputConfigObj = {};

  switch (props.type) {
    case 'text':
      inputConfigObj = {
        textContentType: 'namePrefix',
        returnKeyType: 'next',
      };
      break;

    case 'email':
      inputConfigObj = {
        textContentType: 'emailAddress',
        autoCapitalize: 'none',
        keyboardType: 'email-address',
      };
      break;

    case 'phone':
      inputConfigObj = {
        textContentType: 'telephoneNumber',
        keyboardType: 'phone-pad',
        returnKeyType: 'done',
        maxLength: 10,
      };
      break;

    case 'password':
      inputConfigObj = {
        textContentType: 'password',
        autoCapitalize: 'none',
        returnKeyType: 'done',
        blurOnSubmit: false,
        secureTextEntry: true,
      };
      break;

    case 'otp':
      inputConfigObj = {
        textContentType: 'telephoneNumber',
        autoCapitalize: 'none',
        maxLength: 6,
      };
      break;

    default:
      inputConfigObj = {
        textContentType: 'none',
        autoCapitalize: 'sentences',
        keyboardType: 'default',
        returnKeyType: 'done',
        blurOnSubmit: false,
        maxLength: 30,
        secureTextEntry: false,
      };
      break;
  }

  return (
    <Input
      containerStyle={styles.inputBoxContainer}
      inputContainerStyle={styles.inputContainer}
      inputStyle={styles.input}
      labelStyle={styles.inputLabel}
      textContentType={inputConfigObj.textContentType}
      autoCapitalize={inputConfigObj.autoCapitalize}
      keyboardType={inputConfigObj.keyboardType}
      returnKeyType={inputConfigObj.returnKeyType}
      blurOnSubmit={inputConfigObj.blurOnSubmit}
      maxLength={inputConfigObj.maxLength}
      secureTextEntry={inputConfigObj.secureTextEntry}
      {...props}
    />
  );
}
