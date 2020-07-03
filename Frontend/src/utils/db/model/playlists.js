import {Model, Q} from '@nozbe/watermelondb';
import {lazy} from '@nozbe/watermelondb/decorators';

export class Playlists extends Model {
  static table = 'playlists';
  static associations = {
    playlistsTracks: {type: 'has_many', foreignKey: 'playlistId'},
  };

  @lazy
  tracks = this.collections
    .get('tracks')
    .query(Q.on('playlistsTracks', 'playlistId', this.id));
}
