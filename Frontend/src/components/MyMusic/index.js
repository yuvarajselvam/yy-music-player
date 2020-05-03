import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-elements';
import io from 'socket.io-client';

import {Header} from '../../widgets/Header';

import {commonStyles} from '../common/styles';
import {styles} from './mymusic.styles';

export function MyMusic({navigation}) {
  const [socket] = useState(() =>
    io('http://192.168.0.3:3000', {transports: ['websocket']}),
  );
  const [response, setResponse] = useState('');
  useEffect(() => {
    console.log('My Music socket useEffect');
    socket.on('chat message', data => {
      setResponse(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={commonStyles.screenStyle}>
      <Header navigation={navigation} />
      <Text style={styles.text}>{response}</Text>
    </View>
  );
}
