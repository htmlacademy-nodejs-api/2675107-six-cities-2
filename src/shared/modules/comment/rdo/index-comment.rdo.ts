import { Expose } from 'class-transformer';

export class IndexCommentRdo {
  @Expose()
  public text: string;

  @Expose()
  public rating: number;

  @Expose()
  public userId: string;

  @Expose()
  public createdAt: Date;
}
