import { CityName } from '../../../types/city.type.js';
import { Amenities, AmenitiesEnum, PropertyType, PropertyTypeEnum } from '../../../types/rental-offer.type.js';
import { IsArray, IsEnum, MaxLength, MinLength } from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.message.js';

export class CreateOfferDto {
  // НЕОБЯЗАТ ПОЛЕ @IsOptional()
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title: string;

  public description: string;
  public city: CityName;
  public previewImage: string;
  public photos: string[];
  public isPremium: boolean;

  @IsEnum(PropertyTypeEnum, { message: CreateOfferValidationMessage.type.invalid })
  public propertyType: PropertyType;

  public rooms: number;
  public guests: number;
  public price: number;

  @IsArray({ message: CreateOfferValidationMessage.categories.invalidFormat })
  @IsEnum(AmenitiesEnum, { each: true, message: CreateOfferValidationMessage.type.invalid })
  public amenities: Amenities[];

  public coordinates: { latitude: number; longitude: number };
}
