import React from 'react';
import {View} from 'react-native';
import {Header} from '../../widgets/Header';

import {commonStyles} from '../common/styles';
import {Button} from 'react-native-elements';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {useAuthContext} from '../../contexts/auth.context';

export function Settings({navigation}) {
  const {signOut} = useAuthContext();
  return (
    <View style={commonStyles.screenStyle}>
      <Header navigation={navigation} title="Settings" />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* TODO - signout need to be moved. Added here for testing purpose */}
        <Button
          containerStyle={{width: widthPercentageToDP('50%')}}
          title="SignOut"
          onPress={signOut}
        />
      </View>
    </View>
  );
}
