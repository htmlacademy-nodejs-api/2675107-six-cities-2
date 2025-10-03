import { CityName } from '../../../types/city.type.js';
import { Amenities, PropertyType } from '../../../types/rental-offer.type.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public postDate: Date;
  public city: CityName;
  public previewImage: string;
  public photos: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public propertyType: PropertyType;
  public rooms: number;
  public guests: number;
  public price: number;
  public amenities: Amenities[];
  public userId: string;
  public commentsCount: number;
  public coordinates: { latitude: number; longitude: number };
}
