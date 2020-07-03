import {field} from '@nozbe/watermelondb/decorators';
import {Model} from '@nozbe/watermelondb';

export class PlaylistsTracks extends Model {
  static table = 'playlistsTracks';
  static associations = {
    playlists: {type: 'belongs_to', key: 'playlistId'},
    tracks: {type: 'belongs_to', key: 'trackId'},
  };

  @field('playlistId') playlistId;
  @field('trackId') trackId;
}
