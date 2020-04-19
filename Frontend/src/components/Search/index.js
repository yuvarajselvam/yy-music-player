import React, {useState, useEffect, useRef} from 'react';
import {View, ScrollView, Keyboard, Alert} from 'react-native';
import {
  Card,
  ListItem,
  Image,
  SearchBar,
  Overlay,
  Button,
} from 'react-native-elements';
import {IconButton, Colors} from 'react-native-paper';
import {authService} from '../../services/auth.service';

import {PlayerMain} from '../Player/player.main';
import {styles} from './search.styles';
import {commonStyles} from '../common/styles';

// import {searchResults} from '../../mocks/search.list';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {PlayerProvider} from '../../contexts/player.context';

const initialState = {
  id: '',
  songUrl: '',
};

export function Search() {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [trackObj, setTrackObj] = useState(initialState);

  const searchRef = useRef();
  const getUrl = (urlLink, id) => {
    console.log('URL_LINK', urlLink);
    let obj = {
      songUrl: urlLink,
      id: id,
    };
    setTrackObj(obj);
  };

  useEffect(() => {
    let currentKeyword = searchRef.current.props.value;
    let timer;
    if (currentKeyword.length > 0 && keyword === currentKeyword) {
      timer = setTimeout(() => {
        // console.log('First SetTimeout Started');
        console.log('SEARCH KEYWORD', keyword);
        let data = {
          searchKey: currentKeyword,
          language: 'Tamil',
        };
        authService.getSearch(data).then(async response => {
          if (response.status === 200) {
            let responseObj = await response.json();
            let responseSearchList = responseObj.searchResults;
            console.log(responseSearchList);
            setSearchResults(responseSearchList);
          }
        });
      }, 400);
    }
    return () => {
      console.log('Clear Interval');
      clearTimeout(timer);
      setSearchResults([]);
    };
  }, [keyword]);

  const handleSearch = value => {
    console.log(value);
    setKeyword(value);
  };

  const handleListSelect = (id, type, evt) => {
    let data = {
      _id: id,
      type: type,
    };
    // Need to get the track URL or the album details from backend
    console.log(data);
    if (type === 'track') {
      authService.getTrack(data).then(async response => {
        if (response.status === 200) {
          let responseObj = await response.json();
          let trackUrl = responseObj.url;
          let trackId = responseObj._id;
          getUrl(trackUrl, trackId);
        } else {
          Alert.alert('Song cannot be played at this moment');
        }
      });
    }
  };

  const toggleVerticalButton = () => {
    setIsOverlayVisible(prevState => !prevState);
  };

  return (
    <View style={commonStyles.screenStyle}>
      <OverlayMenu
        toggleVerticalButton={toggleVerticalButton}
        isOverlayVisible={isOverlayVisible}
      />
      <SearchBar
        placeholderTextColor="#FFFFFF"
        iconColor="#FFFFFF"
        ref={searchRef}
        containerStyle={{padding: 0}}
        inputContainerStyle={styles.searchBar}
        inputStyle={styles.searchInput}
        placeholder="Search Songs"
        value={keyword}
        onChangeText={handleSearch}
        blurOnSubmit={false}
        autoFocus={true}
      />
      <Card containerStyle={styles.card}>
        <ScrollView
          onScrollBeginDrag={Keyboard.dismiss}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag">
          {searchResults.map(item => {
            return (
              <ListItem
                onPress={evt => handleListSelect(item._id, item.type, evt)}
                leftElement={
                  <Image
                    style={styles.listImage}
                    source={{
                      uri: item.imageUrl,
                    }}
                  />
                }
                key={item._id}
                subtitle={
                  item.artists +
                  ' - ' +
                  item.type.charAt(0).toUpperCase() +
                  item.type.slice(1)
                }
                subtitleStyle={styles.listSubtitle}
                title={item.name}
                titleStyle={styles.listTitle}
                titleProps={{numberOfLines: 1}}
                bottomDivider
                containerStyle={styles.listContainer}
                rightElement={
                  <IconButton
                    style={styles.listVerticalButton}
                    color={Colors.grey300}
                    size={heightPercentageToDP(2.8)}
                    icon="dots-vertical"
                    onPress={toggleVerticalButton}
                  />
                }
                contentContainerStyle={{
                  width: widthPercentageToDP(58),
                }}
              />
            );
          })}
        </ScrollView>
      </Card>
      <PlayerProvider>
        <PlayerMain trackObj={trackObj} />
      </PlayerProvider>
    </View>
  );
}

function OverlayMenu(props) {
  const {isOverlayVisible, toggleVerticalButton} = props;
  return (
    <Overlay
      height={heightPercentageToDP('32%')}
      width={widthPercentageToDP('100%')}
      containerStyle={styles.overlayContainer}
      transparent={true}
      overlayStyle={styles.overlay}
      animationType="fade"
      overlayBackgroundColor={Colors.grey900}
      isVisible={isOverlayVisible}
      onBackdropPress={toggleVerticalButton}>
      <View style={styles.overlayContent}>
        <Button
          icon={
            <IconButton
              color={Colors.grey300}
              icon="heart-outline"
              onPress={toggleVerticalButton}
            />
          }
          buttonStyle={styles.overlayButtons}
          type="clear"
          title="Like"
          titleStyle={styles.overlayButtonTitle}
        />
        <Button
          icon={
            <IconButton
              color={Colors.grey300}
              icon="playlist-music"
              onPress={toggleVerticalButton}
            />
          }
          buttonStyle={styles.overlayButtons}
          type="clear"
          title="Add to Playlist"
          titleStyle={styles.overlayButtonTitle}
        />
        <Button
          icon={
            <IconButton
              color={Colors.grey300}
              icon="playlist-plus"
              onPress={toggleVerticalButton}
            />
          }
          buttonStyle={styles.overlayButtons}
          type="clear"
          title="Add to Queue"
          titleStyle={styles.overlayButtonTitle}
        />
        <Button
          icon={
            <IconButton
              color={Colors.grey300}
              icon="share-variant"
              onPress={toggleVerticalButton}
            />
          }
          buttonStyle={styles.overlayButtons}
          type="clear"
          title="Share"
          titleStyle={styles.overlayButtonTitle}
        />
      </View>
    </Overlay>
  );
}
