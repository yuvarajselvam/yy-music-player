import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import withObservables from '@nozbe/with-observables';

import {commonStyles} from '../common/styles';
import {Header} from '../../widgets/Header';
import {Text} from 'react-native-elements';
import {database} from '../../utils/db/model';

export function Home({navigation}) {
  const [userRecord, setUserRecord] = useState();
  useEffect(() => {
    console.log('Rendering Home.js');
  }, []);

  const handleClick = async () => {
    const usersCollection = database.collections.get('users');
    const user = await usersCollection.find(
      'USR51ad8c0868684b51a8ab5b7bc380ece1',
    );
    setUserRecord(user);
    navigation.navigate('Notification');
  };

  return (
    <View style={commonStyles.screenStyle}>
      <Header
        navigation={navigation}
        title="Home"
        rightIconName="notifications"
        onRightIconPress={handleClick}
      />
      <EnhancedHome />
    </View>
  );
}

const enhance = withObservables(['user'], ({user}) => ({user: user.observe()}));

export const EnhancedHome = enhance(SubHome);

function SubHome({user}) {
  console.log('Sub home', user);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{user}</Text>
    </View>
  );
}
