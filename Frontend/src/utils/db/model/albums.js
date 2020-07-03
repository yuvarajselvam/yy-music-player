import {lazy} from '@nozbe/watermelondb/decorators';
import {Model, Q} from '@nozbe/watermelondb';

export class Albums extends Model {
  static table = 'albums';

  @lazy
  tracks = this.collections.get('tracks').query(Q.where('albumId', this.id));
}
