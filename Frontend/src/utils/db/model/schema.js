import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        {name: 'email', type: 'string'},
        {name: 'phone', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'username', type: 'string', isOptional: true},
        {name: 'dob', type: 'string', isOptional: true},
        {name: 'imageUrl', type: 'string', isOptional: true},
      ],
    }),
    tableSchema({
      name: 'playlists',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'owner', type: 'string'},
        {name: 'type', type: 'string'},
        {name: 'scope', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'tracks',
      columns: [
        {name: 'albumId', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'artists', type: 'string'},
        {name: 'imageUrl', type: 'string', isOptional: true},
        {name: 'isDownloaded', type: 'boolean'},
        {name: 'path', type: 'string', isOptional: true},
      ],
    }),
    tableSchema({
      name: 'albums',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'artists', type: 'string'},
        {name: 'imageUrl', type: 'string'},
        {name: 'releaseYear', type: 'string', isOptional: true},
        {name: 'totalTracks', type: 'string', isOptional: true},
      ],
    }),
    tableSchema({
      name: 'playlistsTracks',
      columns: [
        {name: 'playlistId', type: 'string'},
        {name: 'trackId', type: 'string'},
      ],
    }),
  ],
});
