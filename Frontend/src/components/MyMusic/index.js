import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Text, Input} from 'react-native-elements';
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
    socket.on('connect', data => {
      setResponse(data);
    });
    socket.on('chat message', data => {
      console.log(data);
      setResponse(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMessage = evt => {
    console.log(evt.nativeEvent.text);
    socket.emit('chat message', evt.nativeEvent.text);
  };
  return (
    <View style={commonStyles.screenStyle}>
      <Header navigation={navigation} title="My Music" />
      <Text style={styles.text}>{response}</Text>
      <Input placeholder="BASIC INPUT" onSubmitEditing={handleMessage} />
      <Text
        style={{
          flex: 1,
          textAlign: 'center',
          textAlignVertical: 'center',
        }}>
        My Library
      </Text>
    </View>
  );
}
