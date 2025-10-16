import { Amenities, PropertyType } from '../../../types/rental-offer.type.js';


export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public previewImage?: string;
  public photos?: string[];
  public propertyType?: PropertyType;
  public rooms?: number;
  public isPremium?: boolean;
  public guests?: number;
  public price?: number;
  public amenities?: Amenities[];
}
