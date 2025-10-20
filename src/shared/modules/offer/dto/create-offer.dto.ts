import { CityName } from '../../../types/city.type.js';
import { Amenities, PropertyType } from '../../../types/rental-offer.type.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public city: CityName;
  public previewImage: string;
  public photos: string[];
  public isPremium: boolean;
  public propertyType: PropertyType;
  public rooms: number;
  public guests: number;
  public price: number;
  public amenities: Amenities[];
  public coordinates: { latitude: number; longitude: number };
}
