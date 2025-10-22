import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CityName } from '../../types/city.type.js';

export interface OfferService {
  create(dto: CreateOfferDto, userId: string): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(limit?: number, userId?: string): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto, userId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiumOfferByCity(city: CityName, userId?: string): Promise<DocumentType<OfferEntity>[]> | null;
  findFavoriteOffer(userId: string): Promise<DocumentType<OfferEntity>[]> | null;
  incCommentCountAndUpdateRating(offerId: string, rating: number): Promise<DocumentType<OfferEntity> | null>;
}
