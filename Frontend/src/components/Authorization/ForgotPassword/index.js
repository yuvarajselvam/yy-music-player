import React, {useState} from 'react';
import {View, Alert, ScrollView, KeyboardAvoidingView} from 'react-native';
import {Button, Image, Text} from 'react-native-elements';

import {InputBox} from '../../../shared/widgets/InputBox';
import {authService} from '../../../services/auth.service';
import {setLocalStore} from '../../../utils/funtions';
import {styles} from '../auth.styles';

export function ForgotPassword({navigation}) {
  const [recoveryEmail, setrecoveryEmail] = useState('');

  const handleOTP = () => {
    let data = {
      email: recoveryEmail,
    };
    authService
      .forgotPassword(data)
      .then(async response => {
        console.log(await response.json());
        if (response.status === 200) {
          let localData = {email: recoveryEmail};
          await setLocalStore(localData);
          navigation.navigate({name: 'EnterOTP'});
          setrecoveryEmail('');
        }
      })
      .catch(error => {
        Alert.alert(error.message);
      });
  };

  return (
    <KeyboardAvoidingView enabled style={styles.main}>
      <ScrollView>
        <View style={styles.forgotPasswordContainer}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.signupLogo}
          />
          <Text style={styles.signupHeading}>FORGOT PASSWORD</Text>
          <InputBox
            label="Email"
            type="email"
            value={recoveryEmail}
            onChangeText={setrecoveryEmail}
          />
          <Button
            raised
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            title="Get OTP"
            onPress={handleOTP}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
