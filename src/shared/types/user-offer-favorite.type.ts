import { RentalOffer } from './rental-offer.type.js';
import { User } from './user.type.js';

export type UserOfferFavorite = {
  userId: User;
  offerId: RentalOffer
};
