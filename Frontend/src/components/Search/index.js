import React, {useState, useEffect, useRef, useContext} from 'react';
import {View, ScrollView, Keyboard, Alert} from 'react-native';
import {
  Card,
  ListItem,
  Image,
  SearchBar,
  Overlay,
  Button,
} from 'react-native-elements';
import {IconButton, Colors, Appbar, Searchbar} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

import {authService} from '../../services/auth.service';
import {PlayerContext} from '../../contexts/player.context';
// import {searchResultsMock} from '../../mocks/search.list';

import {styles} from './search.styles';
import {commonStyles} from '../common/styles';

export function Search({navigation}) {
  console.log('Search screen');
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [selectedTrackItems, setSelectedTrackItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isSelectable, setIsSelectable] = useState(false);

  const searchRef = useRef();
  const {onAddTrack, onPlay} = useContext(PlayerContext);

  const handleTrackSelect = track => {
    onAddTrack(track).then(() => {
      onPlay();
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      return () => {
        setSearchResults([]);
        setKeyword('');
      };
    }, []),
  );

  useEffect(() => {
    let currentKeyword = searchRef.current.props.value;
    let timer;
    if (currentKeyword.length > 0 && keyword === currentKeyword) {
      timer = setTimeout(() => {
        console.log('SEARCH KEYWORD', keyword);
        let data = {
          searchKey: currentKeyword,
          languages: ['Tamil', 'Telugu'],
        };
        authService.getSearch(data).then(async response => {
          if (response.status === 200) {
            let responseObj = await response.json();
            let responseSearchList = responseObj.searchResults;
            let edittedSearchList = responseSearchList.map(value => {
              value.isSelect = false;
              return value;
            });
            setSearchResults(edittedSearchList);
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

  const handleListSelect = (item, evt) => {
    if (isSelectable) {
      return handleLongPress(item);
    }
    let data = {
      _id: item._id,
      language: item.language,
    };
    // console.log(data);
    if (item.type === 'track') {
      authService.getTrack(data).then(async response => {
        if (response.status === 200) {
          let responseObj = await response.json();
          let track = responseObj;
          handleTrackSelect(track);
        } else {
          Alert.alert('Song cannot be played at this moment');
        }
      });
    } else {
      navigation.navigate('Album', data);
    }
  };

  const handleMultiTrackAction = () => {
    console.log(selectedItems);
    setSelectedTrackItems([...selectedItems]);
    setIsOverlayVisible(prevState => !prevState);
  };

  const handleMultiTrackSelection = () => {
    // TBD
    console.log('All tracks to be selected at once');
  };

  const trackVerticalButton = item => {
    setIsOverlayVisible(prevState => !prevState);
    setSelectedTrackItems([item]);
  };

  const handleLongPress = itemObj => {
    if (itemObj.type === 'album') {
      return;
    }
    let itemId = itemObj._id;
    setIsSelectable(true);
    if (selectedItems.has(itemObj)) {
      selectedItems.delete(itemObj);
    } else {
      selectedItems.add(itemObj);
    }
    itemObj.isSelect = !itemObj.isSelect;
    let updatedSearchResults = [...searchResults];
    const index = updatedSearchResults.findIndex(item => itemId === item._id);
    updatedSearchResults[index] = itemObj;
    setSearchResults(updatedSearchResults);
  };

  const handleRemoveSelectedItems = () => {
    let revertItems = [...searchResults];
    console.log(selectedItems);
    selectedItems.forEach(itemObj => {
      let itemToBeRemoved = searchResults.find(item => {
        return item._id === itemObj._id;
      });
      let itemIndex = searchResults.find(item => item._id === itemObj._id);
      itemToBeRemoved.isSelect = !itemToBeRemoved.isSelect;
      revertItems[itemIndex] = itemToBeRemoved;
    });
    setSearchResults(revertItems);
    setIsSelectable(false);
    setSelectedTrackItems([]);
    selectedItems.clear();
  };

  let selectedItemStyle = {
    backgroundColor: Colors.deepPurpleA700,
    opacity: 0.9,
  };

  return (
    <View style={commonStyles.screenStyle}>
      {isOverlayVisible && (
        <OverlayMenu
          handleMultiTrackAction={handleMultiTrackAction}
          isOverlayVisible={isOverlayVisible}
          setIsOverlayVisible={setIsOverlayVisible}
          selectedTrackItems={selectedTrackItems}
          setIsSelectable={setIsSelectable}
          setSelectedTrackItems={setSelectedTrackItems}
        />
      )}
      {isSelectable ? (
        <Appbar style={styles.searchAppBar}>
          <Appbar.Action
            icon="close"
            onPress={handleRemoveSelectedItems}
            color="#FFFFFF"
          />
          <View style={{flexDirection: 'row'}}>
            <Appbar.Action
              icon="select-all"
              color="#FFFFFF"
              onPress={handleMultiTrackSelection}
            />
            <Appbar.Action
              icon="dots-vertical"
              color="#FFFFFF"
              onPress={handleMultiTrackAction}
            />
          </View>
        </Appbar>
      ) : (
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
        />
      )}
      <Card containerStyle={styles.card}>
        <ScrollView
          onScrollBeginDrag={Keyboard.dismiss}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag">
          {searchResults.map((item, index) => {
            return (
              <ListItem
                disabledStyle={{opacity: 0.4}}
                disabled={isSelectable && item.type === 'album'}
                onLongPress={() => handleLongPress(item)}
                onPress={evt => handleListSelect(item, evt)}
                leftElement={
                  <View>
                    <Image
                      // containerStyle={{opacity: 0.5}}
                      style={styles.listImage}
                      source={{
                        uri: item.imageUrl,
                      }}
                    />
                  </View>
                }
                key={index}
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
                containerStyle={[
                  styles.listContainer,
                  isSelectable && item.isSelect && selectedItemStyle,
                ]}
                rightElement={
                  !isSelectable && (
                    <IconButton
                      style={styles.listVerticalButton}
                      color={Colors.grey200}
                      size={heightPercentageToDP(2.8)}
                      icon="dots-vertical"
                      onPress={() => trackVerticalButton(item)}
                    />
                  )
                }
                contentContainerStyle={{
                  width: widthPercentageToDP(58),
                }}
              />
            );
          })}
        </ScrollView>
      </Card>
    </View>
  );
}

function OverlayMenu(props) {
  const {
    isOverlayVisible,
    setIsOverlayVisible,
    selectedTrackItems,
    setIsSelectable,
    setSelectedTrackItems,
  } = props;

  console.log('Overlay menu', selectedTrackItems);

  const handleBackdropPress = () => {
    setIsOverlayVisible(false);
  };

  const handlePlaylistTrackEdit = type => {
    // _id and owner need to updated dynamically from local DB
    let playlist = {
      _id: '5ea1c7c7b566f89fac9947a7',
      owner: '5e7baa1a88a82254f4f8daed',
      tracks: [],
    };
    selectedTrackItems.forEach(track => {
      let trackItem = {};
      trackItem.name = track.name;
      trackItem.id = track._id;
      trackItem.type = 'library';
      trackItem.artists = track.artists;
      playlist.tracks.push(trackItem);
    });

    if (type === 'add') {
      authService.addToPlaylist(playlist).then(response => {
        if (response.status === 200) {
          setIsSelectable(false);
          setIsOverlayVisible(false);
          setSelectedTrackItems([]);
          Alert.alert('Tracks added to playlist successfully');
        } else {
          Alert.alert('Tracks cannot be added to Playlist');
        }
      });
    } else if (type === 'remove') {
      authService.removeFromPlaylist(playlist).then(response => {
        if (response.status === 200) {
          setIsSelectable(false);
          setIsOverlayVisible(false);
          setSelectedTrackItems([]);
          Alert.alert('Tracks removed from playlist successfully');
        } else {
          Alert.alert('Tracks cannot be removed from Playlist');
        }
      });
    }
  };

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
      onBackdropPress={handleBackdropPress}>
      <View style={styles.overlayContent}>
        <Button
          icon={<IconButton color={Colors.grey200} icon="heart-outline" />}
          buttonStyle={styles.overlayButtons}
          type="clear"
          title="Like"
          titleStyle={styles.overlayButtonTitle}
        />
        <Button
          icon={<IconButton color={Colors.grey200} icon="share-variant" />}
          buttonStyle={styles.overlayButtons}
          type="clear"
          title="Share"
          titleStyle={styles.overlayButtonTitle}
        />
        <Button
          icon={<IconButton color={Colors.grey200} icon="playlist-plus" />}
          buttonStyle={styles.overlayButtons}
          type="clear"
          title="Add to Playlist"
          titleStyle={styles.overlayButtonTitle}
          onPress={() => handlePlaylistTrackEdit('add')}
        />
        <Button
          icon={<IconButton color={Colors.grey200} icon="playlist-remove" />}
          buttonStyle={styles.overlayButtons}
          type="clear"
          title="Remove from Playlist"
          titleStyle={styles.overlayButtonTitle}
          onPress={() => handlePlaylistTrackEdit('remove')}
        />
        <Button
          icon={<IconButton color={Colors.grey200} icon="playlist-plus" />}
          buttonStyle={styles.overlayButtons}
          type="clear"
          title="Add to Queue"
          titleStyle={styles.overlayButtonTitle}
        />
      </View>
    </Overlay>
  );
}
