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
        {name: 'imageUrl', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'playlists',
      columns: [{name: 'name', type: 'string'}],
    }),
  ],
});
