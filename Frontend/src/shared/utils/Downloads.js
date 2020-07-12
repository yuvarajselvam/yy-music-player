import {PermissionsAndroid} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {Q} from '@nozbe/watermelondb';

import {database} from '../../utils/db/model';
import {trackService} from '../../services/track.service';

export async function downloadTracks(data) {
  let dirs = RNFetchBlob.fs.dirs;
  console.log('Download path', dirs.DocumentDir);
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    return new Promise((resolve, reject) => {
      trackService.getTrack(data).then(async response => {
        if (response.status === 200) {
          let responseData = await response.json();
          RNFetchBlob.config({
            fileCache: true,
            path: dirs.DocumentDir + `/songs/${responseData.id}.mp3`,
          })
            .fetch('GET', responseData.trackUrl, {})
            .then(async res => {
              console.log('The file saved to ', res.path());
              let trackPath = `file:///${dirs.DocumentDir}/songs/${
                responseData.id
              }.mp3`;
              let tracksCollection = database.collections.get('tracks');
              tracksCollection
                .query(Q.where('id', responseData.id))
                .fetch()
                .then(async tracks => {
                  console.log('Track found ', tracks);
                  if (tracks.length > 0) {
                    await database.action(async () => {
                      try {
                        let trackRecord = await tracksCollection.find(
                          responseData.id,
                        );
                        await trackRecord.update(track => {
                          track._raw.isDownloaded = true;
                          track._raw.path = trackPath;
                        });
                        resolve();
                      } catch (error) {
                        console.error(
                          'Downloaded Track cannot be updated to DB',
                          error,
                        );
                        reject();
                      }
                    });
                  } else {
                    await database.action(async () => {
                      try {
                        const newTrack = await tracksCollection.create(
                          trackRecord => {
                            trackRecord._raw.id = responseData.id;
                            trackRecord._raw.albumId = responseData.album.id;
                            trackRecord._raw.name = responseData.name;
                            trackRecord._raw.imageUrl = responseData.imageUrl;
                            trackRecord._raw.artists = responseData.artists;
                            trackRecord._raw.isDownloaded = true;
                            trackRecord._raw.path = trackPath;
                          },
                        );
                        console.log('Track downloaded record', newTrack);
                        const albumsCollection = await database.collections.get(
                          'albums',
                        );

                        const isAlbumsExists =
                          (await albumsCollection.query(
                            Q.where('id', responseData.album.id),
                          ).fetchCount.length) > 0;

                        if (!isAlbumsExists) {
                          const newAlbum = albumsCollection.create(albumObj => {
                            let album = responseData.album;
                            albumObj._raw.id = album.id;
                            albumObj._raw.name = album.name;
                            albumObj._raw.artists = album.artists;
                            albumObj._raw.totalTracks = album.totalTracks;
                            albumObj._raw.releaseYear = album.releaseYear;
                          });
                          console.log(
                            'Album created for downloaded track',
                            newAlbum,
                          );
                        }
                        resolve();
                      } catch (error) {
                        console.error(
                          'Downloaded Track cannot be updated to DB',
                          error,
                        );
                        reject();
                      }
                    });
                  }
                });
            });
        }
      });
    });
  }
}

export const removeDownloadedTrack = async track => {
  let path = track.trackUrl;
  const tracksCollection = await database.collections.get('tracks');
  const playlistsTracksCollection = await database.collections.get(
    'playlistsTracks',
  );
  const trackRecordToBeDeleted = await tracksCollection.find(track.id);
  const isPlaylistsTracks =
    (await playlistsTracksCollection
      .query(Q.where('trackId', track.id))
      .fetchCount().length) > 0;
  let isOtherTracksPresent =
    (await tracksCollection
      .query(
        Q.where('id', Q.notEq(track.id)),
        Q.where('albumId', track.album.id),
      )
      .fetchCount().length) > 0;

  if (isPlaylistsTracks || isOtherTracksPresent) {
    await database.action(async () => {
      await trackRecordToBeDeleted.update(trackRecord => {
        trackRecord._raw.isDownloaded = false;
        trackRecord._raw.path = null;
      });
    });
  } else {
    let albumRecord = await database.collections
      .get('albums')
      .find(track.album.id);
    await database.action(async () => {
      await trackRecordToBeDeleted.markAsDeleted();
    });
    await database.action(async () => {
      await albumRecord.markAsDeleted();
    });
  }
  return await RNFetchBlob.fs.unlink(path);
};
