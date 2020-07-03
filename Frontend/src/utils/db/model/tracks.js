import {lazy} from '@nozbe/watermelondb/decorators';
import {Model, Q} from '@nozbe/watermelondb';

export class Tracks extends Model {
  static table = 'tracks';
  static associations = {
    playlistsTracks: {type: 'has_many', foreignKey: 'trackId'},
    albums: {type: 'belongs_to', key: 'albumId'},
  };

  @lazy
  playlists = this.collections
    .get('playlists')
    .query(Q.on('playlistsTracks', 'trackId', this.id));
}
