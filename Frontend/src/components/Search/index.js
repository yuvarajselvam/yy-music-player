import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  Keyboard,
  Alert,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import {Button, SearchBar} from 'react-native-elements';
import {IconButton, Colors, Appbar} from 'react-native-paper';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {OverlayModal} from '../../shared/components/OverlayModal';
import ListItems from '../../shared/components/ListItems';
import {trackService} from '../../services/track.service';
import {usePlayerContext} from '../../contexts/player.context';
import {useAuthContext} from '../../contexts/auth.context';
// import {searchResultsMock} from '../../mocks/search.list';

import {database} from '../../utils/db/model';
import {downloadTracks} from '../../shared/utils/Downloads';

import {styles} from './search.styles';
import {commonStyles} from '../common/styles';
import {mySync} from '../../utils/db/model/sync';
import {Q} from '@nozbe/watermelondb';

function SearchComponent({navigation}) {
  console.log('Search screen');
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectable, setIsSelectable] = useState(false);
  const [isPlaylistsOverlayOpen, setIsPlaylistsOverlayOpen] = useState(false);

  const searchRef = useRef();
  const {onAddTrack, onPlay} = usePlayerContext();

  const handleTrackSelect = React.useCallback(track => {
    onAddTrack(track).then(() => {
      onPlay();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            // console.log('search', responseObj);
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

  const handleListSelect = React.useCallback(
    item => {
      Keyboard.dismiss();
      if (isSelectable) {
        return handleLongPress(item);
      }
      let data = {
        id: item.id,
        language: item.language,
      };
      // console.log(data);
      if (item.type === 'Track') {
        trackService
          .getTrack(data)
          .then(track => {
            console.log('Get Track response', track);
            handleTrackSelect(track);
          })
          .catch(err => {
            console.log('Song error', err);
            Alert.alert('Song cannot be played at this moment');
          });
      } else {
        navigation.navigate('Album', data);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSelectable, selectedItems],
  );

  const handleMultiTrackAction = () => {
    console.log(selectedItems);
    setSelectedItems(selectedItems);
    setIsOverlayVisible(prevState => !prevState);
  };

  const trackVerticalButton = React.useCallback(item => {
    setIsOverlayVisible(prevState => !prevState);
    setSelectedItems([item]);
  }, []);

  const handleLongPress = React.useCallback(
    itemObj => {
      if (itemObj.type === 'Album') {
        return;
      }
      let itemId = itemObj.id;
      setIsSelectable(true);
      if (!selectedItems.includes(itemObj)) {
        console.log('selected Items', selectedItems);
        setSelectedItems(prevState => [...prevState, itemObj]);
      } else {
        let filteredSelectedItems = selectedItems.filter(
          item => itemId !== item.id,
        );
        setSelectedItems(filteredSelectedItems);
      }
      itemObj.isSelect = !itemObj.isSelect;
      let updatedSearchResults = [...searchResults];
      const index = updatedSearchResults.findIndex(item => itemId === item.id);
      updatedSearchResults[index] = itemObj;
      setSearchResults(updatedSearchResults);
    },
    [selectedItems, searchResults],
  );

  const handleRemoveSelectedItems = () => {
    if (isSelectable) {
      let revertItems = [...searchResults];
      // console.log(selectedItems);
      selectedItems.forEach(itemObj => {
        let itemToBeRemoved = searchResults.find(item => {
          return item.id === itemObj.id;
        });
        let itemIndex = searchResults.find(item => item.id === itemObj.id);
        itemToBeRemoved.isSelect = !itemToBeRemoved.isSelect;
        revertItems[itemIndex] = itemToBeRemoved;
      });
      setSearchResults(revertItems);
      setIsSelectable(false);
      setSelectedItems([]);
    }
  };

  let selectedItemStyle = {
    backgroundColor: Colors.deepPurpleA700,
    opacity: 0.9,
  };

  const handlePlaylistTrackEdit = type => {
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
          selectedItems={selectedItems}
          setIsSelectable={setIsSelectable}
          handleRemoveSelectedItems={handleRemoveSelectedItems}
        />
      )}
      {isOverlayVisible && (
        <OverlayMenu
          handlePlaylistTrackEdit={handlePlaylistTrackEdit}
          isOverlayVisible={isOverlayVisible}
          setIsOverlayVisible={setIsOverlayVisible}
          selectedTrackItems={selectedItems}
          setIsSelectable={setIsSelectable}
          setSelectedTrackItems={setSelectedItems}
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
          leftIconContainerStyle={{
            padding: 0,
            margin: 0,
            alignItems: 'center',
          }}
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
          disabledValue={'Album'}
        />
      </ScrollView>
    </View>
  );
}

export function OverlayMenu(props) {
  const {
    isOverlayVisible,
    setIsOverlayVisible,
    selectedTrackItems,
    handlePlaylistTrackEdit,
  } = props;

  const handleBackdropPress = () => {
    setIsOverlayVisible(false);
  };

  const handleTrackDownload = async () => {
    console.log('Download', selectedTrackItems[0].language);
    let data = {
      id: selectedTrackItems[0].id,
      language: selectedTrackItems[0].language,
    };
    downloadTracks(data).then(() => {
      setIsOverlayVisible(false);
      ToastAndroid.show('Song downloaded successfully!', ToastAndroid.SHORT);
    });
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
        icon={<IconButton color={Colors.grey200} icon="playlist-plus" />}
        buttonStyle={styles.overlayButtons}
        type="clear"
        title="Add to Queue"
        titleStyle={styles.overlayButtonTitle}
      />
      <Button
        icon={<IconButton color={Colors.grey200} icon="download" />}
        buttonStyle={styles.overlayButtons}
        type="clear"
        title="Download"
        titleStyle={styles.overlayButtonTitle}
        onPress={handleTrackDownload}
      />
    </OverlayModal>
  );
}

// TODO - To be made into a separate component
export function PlaylistsOverlay(props) {
  const {
    isPlaylistsOverlayOpen,
    setIsPlaylistsOverlayOpen,
    selectedItems,
    handleRemoveSelectedItems,
    setIsSelectable,
  } = props;

  const [playlists, setPlaylists] = useState([]);

  const {userInfo} = useAuthContext();

  useEffect(() => {
    const playlistsCollection = database.collections.get('playlists');
    playlistsCollection
      .query()
      .fetch()
      .then(records => {
        // console.log('Myplaylists fetch', records);
        let playlistList = records.map(playlist => {
          let data = {
            id: playlist._raw.id,
            name: playlist._raw.name,
            owner: playlist._raw.owner,
            scope: playlist._raw.scope,
            type: playlist._raw.type,
          };
          return data;
        });
        setPlaylists(playlistList);
      });
  }, [isPlaylistsOverlayOpen]);

  const handleAddToPlaylist = React.useCallback(
    async playlist => {
      // owner need to updated dynamically from local DB
      let playlistObj = {
        id: playlist.id,
        userId: userInfo.id,
        tracks: selectedItems,
      };

      console.log('Playlist overlay', playlistObj.tracks);

      const tracksCollection = await database.collections.get('tracks');
      let tracksList = await playlistObj.tracks.map(trackObj => {
        return tracksCollection.prepareCreate(track => {
          track._raw.id = trackObj.id;
          track._raw.albumId = trackObj.album.id;
          track._raw.name = trackObj.name;
          track._raw.imageUrl = trackObj.imageUrl;
          track._raw.artists = trackObj.artists;
        });
      });
      console.log('Adding tracksList to playlist');

      const playlistsTracksCollection = await database.collections.get(
        'playlistsTracks',
      );
      let playlistsTracksList = await playlistObj.tracks.map(trackObj => {
        return playlistsTracksCollection.prepareCreate(playlistsTrack => {
          playlistsTrack._raw.id = playlistObj.id + '__' + trackObj.id;
          playlistsTrack._raw.playlistId = playlistObj.id;
          playlistsTrack._raw.trackId = trackObj.id;
        });
      });
      console.log('Adding playlistsTracksList to playlist');

      const albumsCollection = await database.collections.get('albums');
      let albumsList = await Promise.all(
        playlistObj.tracks.map(async trackObj => {
          let isAlbumExists =
            (await albumsCollection
              .query(Q.where('id', trackObj.album.id))
              .fetch()).length > 0;
          console.log('Albums exists check ', isAlbumExists);
          if (!isAlbumExists) {
            return albumsCollection.prepareCreate(albumObj => {
              albumObj._raw.id = trackObj.album.id;
              albumObj._raw.name = trackObj.album.name;
              albumObj._raw.artists = trackObj.album.artists;
              albumObj._raw.totalTracks = trackObj.album.totalTracks;
              albumObj._raw.releaseYear = trackObj.album.releaseYear;
            });
          }
        }),
      );

      console.log('Adding albumsList to playlist', albumsList);

      let batchUpdates = [...tracksList, ...playlistsTracksList, ...albumsList];
      try {
        await database.action(async () => {
          await database.batch(...batchUpdates);
        });
        setIsSelectable(false);
        setIsPlaylistsOverlayOpen(false);
        handleRemoveSelectedItems();
        Alert.alert('Success!', 'Tracks added to playlist successfully');
        await mySync();
      } catch (error) {
        console.error(error);
        Alert.alert('Failed!', 'Tracks cannot be added to Playlist');
      }

      console.log('newPlaylistsTrack created successfully');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedItems],
  );

  return (
    <OverlayModal
      visible={isPlaylistsOverlayOpen}
      onBackdropPress={() => setIsPlaylistsOverlayOpen(false)}>
      <ListItems
        options={playlists}
        titleKeys={['name']}
        onPress={handleAddToPlaylist}
        emptyTitle="No Playlists found!"
      />
    </OverlayModal>
  );
}

const Search = React.memo(SearchComponent);

export {Search};
