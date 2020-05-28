export const PlaylistTrackSchema = {
  name: 'PlaylistTrack',
  primaryKey: 'id',
  properties: {
    id: 'string',
    artists: 'string',
    name: 'string',
    type: 'string',
    path: 'string?',
  },
};

export const MyPlaylistSchema = {
  name: 'MyPlaylist',
  // primaryKey: '_id',
  properties: {
    _id: 'string',
    name: 'string',
    type: 'string',
    owner: 'string',
    // tracks: 'PlaylistTrack[]?',
    totalTracks: 'int',
    addedByCount: 'int',
  },
};

export const MyPlaylistsSchema = {
  name: 'MyPlaylists',
  properties: {
    myPlaylists: 'MyPlaylist[]',
  },
};

export const UserSchema = {
  name: 'User',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    email: 'string',
    fullName: 'string',
    authToken: 'string',
    createdAt: 'date',
  },
};

// Todo - watermelon db need to be checked and added
