import React, {useState, useEffect, useRef} from 'react';
import {View, ScrollView, Keyboard, Alert} from 'react-native';
import {Card, ListItem, Image} from 'react-native-elements';
import {authService} from '../../services/auth.service';

import {Searchbar} from 'react-native-paper';

import {PlayerMain} from '../Player/player.main';
import {styles} from './search.styles';

export function Search() {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isMiniPlayerHidden, setIsMiniPlayerHidden] = useState(false);
  const initialState = {
    id: '',
    songUrl: '',
  };
  const [trackObj, setTrackObj] = useState(initialState);

  const getUrl = (urlLink, id) => {
    console.log('URL_LINK', urlLink);
    let obj = {
      songUrl: urlLink,
      id: id,
    };
    setTrackObj(obj);
  };

  const searchRef = useRef();

  useEffect(() => {
    let currentKeyword = searchRef.current.props.value;
    let timer;
    if (keyword === currentKeyword) {
      timer = setTimeout(() => {
        // console.log('First SetTimeout Started');
        console.log('SEARCH KEYWORD', keyword);
        let data = {
          searchKey: currentKeyword,
        };
        authService.getSearch(data).then(async (response) => {
          if (response.status === 200) {
            let responseObj = await response.json();
            let responseSearchList = responseObj.searchResults;
            console.log(responseSearchList);
            setSearchResults(responseSearchList);
            searchRef.current.root.blur();
          }
        });
      }, 400);
    }
    return () => {
      console.log('Clear Interval');
      clearTimeout(timer);
    };
  }, [keyword]);

  useEffect(() => {
    const onKeyboardShow = () => {
      console.log('Hiding the miniplayer addListener');
      setIsMiniPlayerHidden(true);
    };
    Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    return () => {
      console.log('Hiding the miniplayer removeListener');
      Keyboard.removeListener('keyboardDidShow', onKeyboardShow);
    };
  }, [isMiniPlayerHidden]);

  useEffect(() => {
    const onKeyboardHide = () => {
      console.log('Hiding the miniplayer addListener');
      setIsMiniPlayerHidden(false);
      searchRef.current.root.blur();
    };
    Keyboard.addListener('keyboardDidHide', onKeyboardHide);
    return () => {
      console.log('Hiding the miniplayer removeListener');
      Keyboard.removeListener('keyboardDidHide', onKeyboardHide);
    };
  }, [isMiniPlayerHidden]);

  const handleSearch = (value) => {
    console.log(value);
    setKeyword(value);
  };

  const submitSearch = () => {
    searchRef.current.root.blur();
  };

  const handleListSelect = (id, type, evt) => {
    evt.persist();
    let data = {
      _id: id,
      type: type,
    };
    // Need to get the track URL or the album details from backend
    console.log(data);
    if (type === 'track') {
      authService.getTrack(data).then(async (response) => {
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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#121212',
      }}>
      <Searchbar
        placeholderTextColor="#FFFFFF"
        iconColor="#FFFFFF"
        ref={searchRef}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        placeholder="Search Songs"
        value={keyword}
        onChangeText={handleSearch}
        blurOnSubmit={false}
        onSubmitEditing={submitSearch}
      />
      <Card containerStyle={styles.card}>
        <ScrollView
          onScrollBeginDrag={Keyboard.dismiss}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag">
          {searchResults.map((item) => {
            return (
              <ListItem
                onPress={(evt) => handleListSelect(item._id, item.type, evt)}
                leftElement={
                  <Image
                    style={styles.listImage}
                    source={{
                      uri: item.imageUrl,
                    }}
                  />
                }
                key={item._id}
                rightSubtitle={item.type}
                rightSubtitleStyle={styles.listRightSubtitle}
                subtitle={item.artists}
                subtitleStyle={styles.listSubtitle}
                title={item.name}
                titleStyle={styles.listTitle}
                titleProps={{numberOfLines: 1}}
                bottomDivider
                containerStyle={styles.listContainer}
              />
            );
          })}
        </ScrollView>
      </Card>
      {!isMiniPlayerHidden && <PlayerMain trackObj={trackObj} />}
    </View>
  );
}