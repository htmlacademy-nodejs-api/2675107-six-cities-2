import { Expose } from 'class-transformer';

export class OfferRdo {
  @Expose()
  public _id: string;

  @Expose()
  public title: string;
}
