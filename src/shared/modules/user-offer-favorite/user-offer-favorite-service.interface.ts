import { DocumentType } from '@typegoose/typegoose';
import { UserOfferFavoriteEntity } from './user-offer-favorite.entity.js';

export interface UserOfferFavoriteService {
  addToFavorites(userId: string, offerId: string): Promise<DocumentType<UserOfferFavoriteEntity> | null>;
  removeFromFavorites(userId: string, offerId: string): Promise<DocumentType<UserOfferFavoriteEntity> | null>;
}

