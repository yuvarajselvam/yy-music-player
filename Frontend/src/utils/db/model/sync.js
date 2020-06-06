import {synchronize} from '@nozbe/watermelondb/sync';

import {database} from './index';
import {getLocalStore} from '../../funtions';

export async function mySync() {
  let localObj = await getLocalStore();
  let bearer = 'Bearer ' + localObj.authToken;
  console.log('mySync auth heade', bearer);
  await synchronize({
    database,
    pullChanges: async ({lastPulledAt}) => {
      const response = await fetch(
        `https://19432c36c34b.ngrok.io/sync/?last_pulled_at=${lastPulledAt}`,
        {
          method: 'GET',
          headers: {
            Authorization: bearer,
          },
        },
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }

      const {changes, timestamp} = await response.json();
      console.log('WMDB Pull changes', changes);
      return {changes, timestamp};
    },
    pushChanges: async ({changes, lastPulledAt}) => {
      const response = await fetch(
        `https://19432c36c34b.ngrok.io/sync/?last_pulled_at=${lastPulledAt}`,
        {
          method: 'POST',
          body: JSON.stringify(changes),
          headers: {
            Authorization: bearer,
          },
        },
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }
    },
  });
}
