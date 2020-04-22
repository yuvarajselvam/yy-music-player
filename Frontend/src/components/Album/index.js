import React from 'react';
import {View, ScrollView, Animated} from 'react-native';
import {Image, Text, ListItem, Icon} from 'react-native-elements';
import {Colors} from 'react-native-paper';

import {Header} from '../../widgets/Header';
import {album} from '../../mocks/album';

import {commonStyles} from '../common/styles';
import {styles} from './album.style';

export function Album(props) {
  const {navigation, route} = props;
  // let album = route.params;
  // console.log(album);
  const tracks = album.tracks;
  return (
    <View style={commonStyles.screenStyle}>
      <Header navigation={navigation} />
      <ScrollView>
        <View style={{alignItems: 'center', padding: 12}}>
          <Image source={{uri: album.imageUrl}} style={styles.albumImage} />
          <Text h4 style={{color: Colors.grey300}}>
            {album.name}
          </Text>
          <Text style={{color: Colors.grey300}}>{album.artists[0].name}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: Colors.grey300}}>{album.releaseYear}</Text>
            {/* <Text style={{color: Colors.grey300}}>{album.totalTracks}</Text> */}
          </View>
          <Icon
            raised
            reverse
            name="play"
            type="material-community"
            color={Colors.grey500}
            onPress={() => console.log('hello')}
          />
        </View>
        <View style={{flex: 1}}>
          {tracks.map((item, index) => {
            return (
              <ListItem
                containerStyle={{
                  padding: 0,
                  paddingLeft: 12,
                  paddingRight: 4,
                  backgroundColor: Colors.grey900,
                  borderBottomWidth: 0,
                }}
                contentContainerStyle={{padding: 10}}
                // leftElement={
                //   <View style={{paddingLeft: 10, alignItems: 'center'}}>
                //     <Text style={{color: Colors.grey300}}>{trackNumber}</Text>
                //   </View>
                // }
                key={index}
                title={item.name}
                titleStyle={{color: Colors.grey300}}
                subtitle={'Artists Name'}
                subtitleStyle={{color: Colors.grey300}}
                onPress={() => console.log('Album track selected')}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
