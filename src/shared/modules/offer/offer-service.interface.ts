import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CityName } from '../../types/city.type.js';
import { DocumentExists } from '../../libs/express/index.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto, userId: string): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null>;
  find(limit?: number, page?: number, userId?: string): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string, userId: string): Promise<string>;
  updateById(offerId: string, dto: Partial<UpdateOfferDto>, userId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiumOfferByCity(city: CityName, userId?: string | undefined): Promise<DocumentType<OfferEntity>[]> | null;
  findFavoriteOffer(userId: string): Promise<DocumentType<OfferEntity>[]> | null;
  incCommentCountAndUpdateRating(offerId: string, rating: number): Promise<DocumentType<OfferEntity> | null>;
  updatePreviewImage(offerId: string, file: string | undefined, userId: string): Promise<DocumentType<OfferEntity>>;
  updatePhotos(offerId: string, newFilepaths: string[],userId: string): Promise<DocumentType<OfferEntity>>;
}
