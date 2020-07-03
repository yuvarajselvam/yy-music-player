import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import {mySchema} from './schema';

import Users from './users';
import {Tracks} from './tracks';
import {Playlists} from './playlists';
import {PlaylistsTracks} from './playlistsTracks';
import {Albums} from './albums';

const adapter = new SQLiteAdapter({
  dbName: 'YYMP',
  schema: mySchema,
});

const database = new Database({
  adapter,
  modelClasses: [Users, Tracks, Playlists, PlaylistsTracks, Albums],
  actionsEnabled: true,
});

export {database};
