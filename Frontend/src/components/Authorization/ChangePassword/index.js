import React, {useState} from 'react';
import {View, KeyboardAvoidingView, ScrollView} from 'react-native';
import {Image, Text, Button} from 'react-native-elements';

import {InputBox} from '../../../widgets/InputBox';
import {authService} from '../../../services/auth.service';
import {getLocalStore} from '../../../utils/funtions';
import {styles} from '../auth.styles';

export function ChangePassword({navigation}) {
  const [newPassword, setnewPassword] = useState('');

  const handlePasswordChange = async () => {
    let localData = await getLocalStore();
    let data = {
      grantType: 'forgot_password_token',
      newPassword: newPassword,
      email: localData.email,
    };
    authService.changePassword(data).then(response => {
      if (response.status === 200) {
        navigation.navigate('Login');
        setnewPassword('');
      }
    });
  };

  return (
    <KeyboardAvoidingView style={styles.main}>
      <ScrollView>
        <View style={styles.signupContainer}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.signupLogo}
          />
          <Text style={styles.signupHeading}>New Password</Text>
          <InputBox
            label="Enter password"
            type="password"
            value={newPassword}
            onChangeText={setnewPassword}
          />
          <Button
            raised
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            title="Submit"
            onPress={handlePasswordChange}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
