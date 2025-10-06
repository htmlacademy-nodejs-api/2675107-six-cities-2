import { DocumentType } from '@typegoose/typegoose';
import { CreateUserOfferFavoriteDto } from './dto/create-user-offer-favorite.dto.js';
import { UserOfferFavoriteEntity } from './user-offer-favorite.entity.js';

export interface UserOfferFavoriteService {
  create(dto: CreateUserOfferFavoriteDto): Promise<DocumentType<UserOfferFavoriteEntity>>;
  findById(UserOfferFavoriteId: string): Promise<DocumentType<UserOfferFavoriteEntity> | null>;
  findByUserAndOffer(userId: string, offerId: string): Promise<DocumentType<UserOfferFavoriteEntity> | null>;
  createIfNotExists(dto: CreateUserOfferFavoriteDto): Promise<DocumentType<UserOfferFavoriteEntity> | null>;
}

