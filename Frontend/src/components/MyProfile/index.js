import React from 'react';
import {View} from 'react-native';
import {Text, Avatar, Card, ListItem, Icon, Badge} from 'react-native-elements';
import {Colors} from 'react-native-paper';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Header} from '../../widgets/Header';
import {useAuthContext} from '../../contexts/auth.context';
import {styles} from './myprofile.styles';

export function MyProfile(props) {
  const {navigation} = props;

  const {userInfo} = useAuthContext();
  return (
    <View style={{flex: 1}}>
      <Header title="My Profile" navigation={navigation} />
      <Card
        containerStyle={styles.cardContainer}
        wrapperStyle={styles.cardWrapper}>
        <Avatar
          size="xlarge"
          rounded
          source={{
            uri:
              'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
          }}
        />
        <Text h4>{userInfo.name}</Text>
        <Text>@ {userInfo.id}</Text>
      </Card>
      <ListItem
        containerStyle={styles.listContainer}
        title={userInfo.email}
        titleStyle={{
          color: Colors.grey200,
        }}
        rightElement={
          <Icon
            style={{padding: 0, margin: 0}}
            color={Colors.grey200}
            name="edit"
          />
        }
      />
      <ListItem
        containerStyle={styles.listContainer}
        title="Followers"
        // rightElement={() => (
        //   <RightIcon badgeValue={userInfo.followers.length} />
        // )}
        onPress={() => navigation.navigate('Followers')}
      />
      <ListItem
        containerStyle={styles.listContainer}
        title="Following"
        // rightElement={() => (
        //   <RightIcon badgeValue={userInfo.following.length} />
        // )}
        onPress={() => navigation.navigate('Following')}
      />
      <ListItem
        containerStyle={styles.listContainer}
        title="Pending Requests"
        // rightElement={() => (
        //   <RightIcon badgeValue={userInfo.pendingRequests.length} />
        // )}
        onPress={() => navigation.navigate('Requests')}
      />
    </View>
  );
}

function RightIcon(props) {
  const {badgeValue} = props;
  return (
    <View style={styles.rightIconContainer}>
      <Badge
        badgeStyle={{borderWidth: 0}}
        value={badgeValue}
        style={{alignSelf: 'center'}}
      />
      <Icon
        style={{padding: 0, margin: 0}}
        color={Colors.grey200}
        size={hp(2.8)}
        name="chevron-right"
      />
    </View>
  );
}
