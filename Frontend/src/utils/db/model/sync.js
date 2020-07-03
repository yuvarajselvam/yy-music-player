import {synchronize} from '@nozbe/watermelondb/sync';
import {Subject} from 'rxjs';

import {database} from './index';
import {getLocalStore} from '../../funtions';
import {getMethod, postMethod} from '../../../services/service.util';

export const userSubject = new Subject();
export const playlistsSubject = new Subject();
export const playlistsTracksSubject = new Subject();
export const albumSubject = new Subject();

export async function mySync() {
  let localObj = await getLocalStore();
  let bearer = 'Bearer ' + localObj.authToken;
  console.log('mySync auth header', bearer);
  await synchronize({
    database,
    pullChanges: async ({lastPulledAt}) => {
      let endPoint = `sync/?last_pulled_at=${lastPulledAt}`;
      const response = await getMethod(endPoint);
      if (!response.ok) {
        throw new Error(await response.text());
      }

      const {changes, timestamp} = await response.json();
      console.log('WMDB Pull changes', changes);
      if (
        changes.playlistsTracks.created.length > 0 ||
        changes.playlistsTracks.deleted.length > 0
      ) {
        setTimeout(() => {
          playlistsTracksSubject.next(true);
        }, 800);
      }
      if (
        changes.playlists.created.length > 0 ||
        changes.playlists.deleted.length > 0
      ) {
        setTimeout(() => {
          playlistsSubject.next(true);
        }, 800);
      }
      return {changes, timestamp};
    },
    pushChanges: async ({changes, lastPulledAt}) => {
      console.log('Sync Push changes', changes);
      let endPoint = `sync/?last_pulled_at=${lastPulledAt}`;
      const response = await postMethod(endPoint, changes);
      if (!response.ok) {
        throw new Error(await response.text());
      }
    },
  });
}
