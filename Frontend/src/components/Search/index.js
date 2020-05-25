import React, {useState, useEffect, useRef} from 'react';
import {View, ScrollView, Keyboard, Alert, BackHandler} from 'react-native';
import {Button, SearchBar} from 'react-native-elements';
import {IconButton, Colors, Appbar} from 'react-native-paper';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {OverlayModal} from '../../widgets/OverlayModal';
import {trackService} from '../../services/track.service';
import {usePlayerContext} from '../../contexts/player.context';
// import {searchResultsMock} from '../../mocks/search.list';

import {styles} from './search.styles';
import {commonStyles} from '../common/styles';
import {useAuthContext} from '../../contexts/auth.context';
import {ListItems} from '../../widgets/ListItems';

export function Search({navigation}) {
  console.log('Search screen');
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [selectedTrackItems, setSelectedTrackItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectable, setIsSelectable] = useState(false);

  const searchRef = useRef();
  const {onAddTrack, onPlay} = usePlayerContext();

  const handleTrackSelect = track => {
    onAddTrack(track).then(() => {
      onPlay();
    });
  };

  useEffect(() => {
    if (isSelectable) {
      const backAction = () => {
        Alert.alert(
          'Hold on!',
          'Are you sure you want to cancel the selection ?',
          [
            {
              text: 'No',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'YES',
              onPress: () => {
                setIsSelectable(false);
              },
            },
          ],
        );
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }
  }, [isSelectable]);

  useEffect(() => {
    let timer;
    if (
      searchRef.current.props.value.length > 0 &&
      keyword === searchRef.current.props.value
    ) {
      timer = setTimeout(() => {
        console.log('SEARCH KEYWORD', keyword);
        let data = {
          searchKey: searchRef.current.props.value,
          languages: ['Tamil'],
        };
        trackService.getSearch(data).then(async response => {
          if (response.status === 200) {
            let responseObj = await response.json();
            let responseSearchList = responseObj.searchResults;
            let edittedSearchList = responseSearchList.map(value => {
              value.isSelect = false;
              return value;
            });
            if (responseObj.searchKey === searchRef.current.props.value) {
              setSearchResults(edittedSearchList);
            }
          }
        });
      }, 200);
    }
    return () => {
      // console.log('Clear Interval');
      clearTimeout(timer);
    };
  }, [keyword]);

  const handleSearch = value => {
    setKeyword(value);
  };

  const handleListSelect = item => {
    Keyboard.dismiss();
    if (isSelectable) {
      return handleLongPress(item);
    }
    let data = {
      _id: item._id,
      language: item.language,
    };
    // console.log(data);
    if (item.type === 'track') {
      trackService.getTrack(data).then(async response => {
        if (response.status === 200) {
          let responseObj = await response.json();
          let track = responseObj;
          handleTrackSelect(track);
        } else {
          Alert.alert('Oops!', 'Song cannot be played at this moment');
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
    if (!selectedItems.includes(itemObj)) {
      setSelectedItems(prevState => [...prevState, itemObj]);
    } else {
      let filteredSelectedItems = selectedItems.filter(
        item => itemId !== item._id,
      );
      setSelectedItems(filteredSelectedItems);
    }
    itemObj.isSelect = !itemObj.isSelect;
    let updatedSearchResults = [...searchResults];
    const index = updatedSearchResults.findIndex(item => itemId === item._id);
    updatedSearchResults[index] = itemObj;
    setSearchResults(updatedSearchResults);
  };

  const handleRemoveSelectedItems = () => {
    let revertItems = [...searchResults];
    // console.log(selectedItems);
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
    setSelectedItems([]);
  };

  let selectedItemStyle = {
    backgroundColor: Colors.deepPurpleA700,
    opacity: 0.9,
  };

  const [isPlaylistsOverlayOpen, setIsPlaylistsOverlayOpen] = useState(false);
  const [actionType, setActionType] = useState('');

  const handlePlaylistTrackEdit = type => {
    setActionType(type);
    setIsOverlayVisible(false);
    setIsPlaylistsOverlayOpen(true);
  };

  const clearSearch = () => {
    setKeyword('');
    setSearchResults([]);
  };

  return (
    <View style={commonStyles.screenStyle}>
      {isPlaylistsOverlayOpen && (
        <PlaylistsOverlay
          isPlaylistsOverlayOpen={isPlaylistsOverlayOpen}
          setIsPlaylistsOverlayOpen={setIsPlaylistsOverlayOpen}
          actionType={actionType}
          selectedTrackItems={selectedTrackItems}
          setIsSelectable={setIsSelectable}
          setSelectedTrackItems={setSelectedTrackItems}
          setSelectedItems={setSelectedItems}
        />
      )}
      {isOverlayVisible && (
        <OverlayMenu
          handlePlaylistTrackEdit={handlePlaylistTrackEdit}
          isOverlayVisible={isOverlayVisible}
          setIsOverlayVisible={setIsOverlayVisible}
          selectedTrackItems={selectedTrackItems}
          setIsSelectable={setIsSelectable}
          setSelectedTrackItems={setSelectedTrackItems}
          setSelectedItems={setSelectedItems}
        />
      )}
      {isSelectable ? (
        <Appbar style={styles.searchAppBar}>
          <Appbar.Action
            icon="close"
            onPress={handleRemoveSelectedItems}
            color="#FFFFFF"
          />
          <Appbar.Content
            title={selectedItems.length}
            titleStyle={{color: Colors.grey200}}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Appbar.Action
              icon="dots-vertical"
              color="#FFFFFF"
              onPress={handleMultiTrackAction}
            />
          </View>
        </Appbar>
      ) : (
        <SearchBar
          placeholderTextColor="#FFFFFF"
          iconColor="#FFFFFF"
          ref={searchRef}
          containerStyle={styles.searchContainer}
          inputContainerStyle={{padding: 0, margin: 0}}
          inputStyle={styles.searchInput}
          placeholder="Search Songs"
          value={keyword}
          onChangeText={handleSearch}
          round={false}
          clearIcon={
            <IconButton
              icon="close"
              color={Colors.grey300}
              size={wp(4.8)}
              onPress={clearSearch}
            />
          }
          searchIcon={
            <IconButton
              style={{padding: 0, margin: 0}}
              icon="magnify"
              color={Colors.grey300}
              size={wp(5.6)}
              onPress={clearSearch}
            />
          }
          leftIconContainerStyle={{padding: 0, margin: 0, alignItems: 'center'}}
          rightIconContainerStyle={{
            padding: 0,
            margin: 0,
            alignItems: 'center',
          }}
        />
      )}
      <ScrollView
        onScrollBeginDrag={Keyboard.dismiss}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag">
        <ListItems
          options={searchResults}
          titleKeys={['name']}
          subtitleKeys={['artists', 'type']}
          rightIconName={!isSelectable && 'more-vert'}
          onRightIconPress={trackVerticalButton}
          onLongPress={handleLongPress}
          onPress={handleListSelect}
          listSelectedStyle={isSelectable && selectedItemStyle}
          leftAvatarKey="imageUrl"
          disabledKey={isSelectable && 'type'}
          disabledValue={'album'}
        />
      </ScrollView>
    </View>
  );
}

function OverlayMenu(props) {
  const {
    isOverlayVisible,
    setIsOverlayVisible,
    handlePlaylistTrackEdit,
  } = props;

  const handleBackdropPress = () => {
    setIsOverlayVisible(false);
  };

  return (
    <OverlayModal
      position="bottom"
      visible={isOverlayVisible}
      onBackdropPress={handleBackdropPress}>
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
    </OverlayModal>
  );
}

function PlaylistsOverlay(props) {
  const {
    isPlaylistsOverlayOpen,
    setIsPlaylistsOverlayOpen,
    setSelectedItems,
    selectedTrackItems,
    setSelectedTrackItems,
    setIsSelectable,
    actionType,
  } = props;

  console.log('Playlist overlay', selectedTrackItems);

  const [playlists, setPlaylists] = useState([]);

  const {userInfo} = useAuthContext();

  useEffect(() => {
    trackService.getMyPlaylists().then(async response => {
      let responseObj = await response.json();
      console.log('Playlist overlay list ', responseObj);
      setPlaylists(responseObj);
    });
  }, [isPlaylistsOverlayOpen]);

  const handlePlaylistSelect = playlist => {
    // owner need to updated dynamically from local DB
    let playlistObj = {
      _id: playlist._id,
      owner: userInfo.id,
      tracks: [],
    };
    selectedTrackItems.forEach(track => {
      let trackItem = {};
      trackItem.name = track.name;
      trackItem.id = track._id;
      trackItem.type = 'library';
      trackItem.artists = track.artists;
      playlistObj.tracks.push(trackItem);
    });

    if (actionType === 'add') {
      trackService.addToPlaylist(playlistObj).then(response => {
        if (response.status === 200) {
          setIsSelectable(false);
          setIsPlaylistsOverlayOpen(false);
          setSelectedTrackItems([]);
          Alert.alert('Success!', 'Tracks added to playlist successfully');
        } else {
          Alert.alert('Failed!', 'Tracks cannot be added to Playlist');
        }
      });
    } else if (actionType === 'remove') {
      trackService.removeFromPlaylist(playlist).then(response => {
        if (response.status === 200) {
          setIsSelectable(false);
          setIsPlaylistsOverlayOpen(false);
          setSelectedTrackItems([]);
          Alert.alert('Success!', 'Tracks removed from playlist successfully');
        } else {
          Alert.alert('Failed!', 'Tracks cannot be removed from Playlist');
        }
      });
    }
    setSelectedItems([]);
  };

  return (
    <OverlayModal
      visible={isPlaylistsOverlayOpen}
      onBackdropPress={() => setIsPlaylistsOverlayOpen(false)}>
      <ListItems
        options={playlists}
        titleKeys={['name']}
        onPress={handlePlaylistSelect}
      />
    </OverlayModal>
  );
}
