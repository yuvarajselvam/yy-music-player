import React from 'react';
import {View} from 'react-native';
import {Text, Avatar, Card, Badge} from 'react-native-elements';
import {Header} from '../../widgets/Header';
import {useAuthContext} from '../../contexts/auth.context';
import {styles} from './myprofile.styles';
import {ListItems} from '../../widgets/ListItems';

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
      <ListItems
        single={true}
        titleText={userInfo.email}
        rightIconName="edit"
      />
      <ListItems
        single={true}
        titleText="Followers"
        onPress={() => navigation.navigate('Followers')}
      />
      <ListItems
        single={true}
        titleText="Following"
        onPress={() => navigation.navigate('Following')}
      />
      <ListItems
        single={true}
        titleText="Pending Requests"
        onPress={() => navigation.navigate('Requests')}
      />
    </View>
  );
}

// function RightIcon(props) {
//   const {badgeValue} = props;
//   return (
//     <View style={styles.rightIconContainer}>
//       <Badge
//         badgeStyle={{borderWidth: 0}}
//         value={badgeValue}
//         style={{alignSelf: 'center'}}
//       />
//       <Icon
//         style={{padding: 0, margin: 0}}
//         color={Colors.grey200}
//         size={hp(2.8)}
//         name="chevron-right"
//       />
//     </View>
//   );
// }
