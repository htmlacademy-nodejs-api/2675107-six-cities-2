import { Expose } from 'class-transformer';

export class UserRdo {
  @Expose()
  public _id: string;

  @Expose()
  public email: string ;

  @Expose()
  public avatarPath: string;

  @Expose()
  public firstname: string;

  @Expose()
  public type: string;
}
