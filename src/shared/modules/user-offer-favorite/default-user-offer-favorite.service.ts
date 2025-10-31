import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { UserOfferFavoriteService } from './user-offer-favorite-service.interface.js';
import { UserOfferFavoriteEntity } from './user-offer-favorite.entity.js';

@injectable()
export class DefaultUserOfferFavoriteService implements UserOfferFavoriteService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserOfferFavoriteModel) private readonly userOfferFavoriteModel: types.ModelType<UserOfferFavoriteEntity>
  ) {}

  public async addToFavorites(
    userId: string,
    offerId: string
  ): Promise<DocumentType<UserOfferFavoriteEntity> | null> {
    const existing = await this.userOfferFavoriteModel.findOne({ userId, offerId }).exec();

    if (existing) {
      this.logger.warn(`Offer ${offerId} is already in favorites for user ${userId}`);
      return null;
    }

    const result = await this.userOfferFavoriteModel.create({ userId, offerId });
    this.logger.info(`Offer ${offerId} added to favorites by user ${userId}`);
    return result;
  }

  public async removeFromFavorites(
    userId: string,
    offerId: string
  ): Promise<DocumentType<UserOfferFavoriteEntity> | null> {
    try {
      const existing = await this.userOfferFavoriteModel.findOne({ userId, offerId }).exec();

      if (!existing) {
        this.logger.warn(`Offer ${offerId} not found in favorites for user ${userId}`);
        throw new Error('You are not allowed to edit this offer');
      }

      await this.userOfferFavoriteModel.deleteOne({ _id: existing._id });
      this.logger.info(`Offer ${offerId} removed from favorites by user ${userId}`);

      return existing;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to delete favorite offers ${errorMessage}`);

      throw new Error(`Failed to delete favorite offers ${errorMessage}`);
    }
  }
}
