import { CityEnum, CityName } from '../../../types/city.type.js';
import { Amenities, AmenitiesEnum, PropertyType, PropertyTypeEnum } from '../../../types/rental-offer.type.js';
import { IsArray, IsBoolean, IsEnum, IsInt, IsObject, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.message.js';

export class CreateOfferDto {
  // НЕОБЯЗАТ ПОЛЕ @IsOptional()
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  @IsString({ message: CreateOfferValidationMessage.title.invalidFormat })
  public title: string;

  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  @IsString({ message: CreateOfferValidationMessage.title.invalidFormat })
  public description: string;

  @IsEnum(CityEnum, { message: CreateOfferValidationMessage.city.invalid })
  public city: CityName;

  @IsString({ message: CreateOfferValidationMessage.previewImage.invalidFormat })
  public previewImage: string;

  @IsArray({ message: CreateOfferValidationMessage.photos.invalidFormat })
  public photos: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsEnum(PropertyTypeEnum, { message: CreateOfferValidationMessage.propertyType.invalid })
  public propertyType: PropertyType;

  @Min(1, { message: CreateOfferValidationMessage.rooms.minValue })
  @Max(8, { message: CreateOfferValidationMessage.rooms.maxValue })
  @IsInt({ message: CreateOfferValidationMessage.rooms.invalidFormat })
  public rooms: number;

  @Min(1, { message: CreateOfferValidationMessage.guests.minValue })
  @Max(10, { message: CreateOfferValidationMessage.guests.maxValue })
  @IsInt({ message: CreateOfferValidationMessage.guests.invalidFormat })
  public guests: number;

  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  public price: number;

  @IsEnum(AmenitiesEnum, { each: true, message: CreateOfferValidationMessage.amenities.invalid })
  public amenities: Amenities[];

  @IsObject({ message: CreateOfferValidationMessage.coordinates.invalidFormat })
  public coordinates: { latitude: number; longitude: number };
}
