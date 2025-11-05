import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class IndexCommentRdo {
  @Expose()
  public text: string;

  @Expose()
  public rating: number;

  @Expose()
  @Type(() => UserRdo)
  public userId: UserRdo;

  @Expose()
  public createdAt: Date;
}
