import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import {mySchema} from './schema';

import Users from './users';

const adapter = new SQLiteAdapter({
  dbName: 'YYMP',
  schema: mySchema,
});

const database = new Database({
  adapter,
  modelClasses: [Users],
  actionsEnabled: true,
});

export {database};
