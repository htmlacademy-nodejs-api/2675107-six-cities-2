import { Expose } from 'class-transformer';

export class OfferRdo {

  @Expose()
  public title: string;

  @Expose()
  public price: number;

  @Expose()
  public propertyType: string;

  @Expose()
  public postDate: Date;

  @Expose()
  public city: string;

  @Expose()
  public previewImage: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public commentsCount: number;

  @Expose()
  public isFavorite?: boolean;
}
