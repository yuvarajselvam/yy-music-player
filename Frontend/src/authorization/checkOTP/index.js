import {View, KeyboardAvoidingView, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {Input, Image, Text, Button} from 'react-native-elements';

import {styles} from '../auth.styles';
import {authService} from '../../services/auth.service';
import {getLocalStore} from '../../utils/funtions';

export function EnterOTP({navigation}) {
  const [otp, setOtp] = useState('');

  const submitOTP = async () => {
    let currentTime = new Date();
    let date = currentTime.getDate();
    let month = currentTime.getMonth() + 1;
    let year = currentTime.getFullYear();
    let hour = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let seconds = currentTime.getSeconds();
    let timestamp =
      date.toString() +
      '/' +
      month.toString() +
      '/' +
      year.toString().slice(2) +
      ' ' +
      hour.toString() +
      ':' +
      minutes.toString() +
      ':' +
      seconds.toString();

    let localData = await getLocalStore();
    let data = {
      email: localData.email,
      token: otp,
      timestamp: timestamp,
    };

    authService.validateForgotPassword(data).then(async response => {
      console.log(await response.json());
      if (response.status === 200) {
        navigation.navigate('ChangePassword');
        setOtp('');
      }
    });
  };

  return (
    <KeyboardAvoidingView style={styles.main}>
      <ScrollView>
        <View style={styles.signupContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.signupLogo}
          />
          <Text style={styles.signupHeading}>Verify the OTP</Text>
          <Input
            labelStyle={styles.inputLabel}
            containerStyle={styles.inputBoxContainer}
            inputStyle={styles.inputText}
            label="Enter the OTP"
            returnKeyType={'next'}
            blurOnSubmit={false}
            maxLength={6}
            textContentType="namePrefix"
            value={otp}
            onChangeText={setOtp}
          />
          <Button
            raised
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            title="Submit OTP"
            onPress={submitOTP}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
