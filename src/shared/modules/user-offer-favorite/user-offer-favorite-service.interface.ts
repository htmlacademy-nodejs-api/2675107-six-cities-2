
export interface UserOfferFavoriteService {
  addToFavorites(userId: string, offerId: string): Promise<string>;
  removeFromFavorites(userId: string, offerId: string): Promise<string>;
}

