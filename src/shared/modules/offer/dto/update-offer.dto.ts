import { CityEnum, CityName } from '../../../types/city.type.js';
import { Amenities, AmenitiesEnum, PropertyType, PropertyTypeEnum } from '../../../types/rental-offer.type.js';
import { IsArray, IsBoolean, IsEnum, IsInt, IsObject, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.message.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  @IsString({ message: CreateOfferValidationMessage.title.invalidFormat })
  public title: string;

  @IsOptional()
  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  @IsString({ message: CreateOfferValidationMessage.title.invalidFormat })
  public description: string;

  @IsOptional()
  @IsEnum(CityEnum, { message: CreateOfferValidationMessage.city.invalid })
  public city: CityName;

  @IsOptional()
  @IsString({ message: CreateOfferValidationMessage.previewImage.invalidFormat })
  public previewImage: string;

  @IsOptional()
  @IsArray({ message: CreateOfferValidationMessage.photos.invalidFormat })
  public photos: string[];

  @IsOptional()
  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalidFormat })
  public isPremium: boolean;

  @IsOptional()
  @IsEnum(PropertyTypeEnum, { message: CreateOfferValidationMessage.propertyType.invalid })
  public propertyType: PropertyType;

  @IsOptional()
  @Min(1, { message: CreateOfferValidationMessage.rooms.minValue })
  @Max(8, { message: CreateOfferValidationMessage.rooms.maxValue })
  @IsInt({ message: CreateOfferValidationMessage.rooms.invalidFormat })
  public rooms: number;

  @IsOptional()
  @Min(1, { message: CreateOfferValidationMessage.guests.minValue })
  @Max(10, { message: CreateOfferValidationMessage.guests.maxValue })
  @IsInt({ message: CreateOfferValidationMessage.guests.invalidFormat })
  public guests: number;

  @IsOptional()
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  public price: number;

  @IsOptional()
  @IsEnum(AmenitiesEnum, { each: true, message: CreateOfferValidationMessage.amenities.invalid })
  public amenities: Amenities[];

  @IsOptional()
  @IsObject({ message: CreateOfferValidationMessage.coordinates.invalidFormat })
  public coordinates: { latitude: number; longitude: number };
}
