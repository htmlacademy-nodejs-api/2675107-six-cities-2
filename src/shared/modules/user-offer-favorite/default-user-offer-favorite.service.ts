import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { types } from '@typegoose/typegoose';
import { UserOfferFavoriteService } from './user-offer-favorite-service.interface.js';
import { UserOfferFavoriteEntity } from './user-offer-favorite.entity.js';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../../libs/express/index.js';

@injectable()
export class DefaultUserOfferFavoriteService implements UserOfferFavoriteService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserOfferFavoriteModel) private readonly userOfferFavoriteModel: types.ModelType<UserOfferFavoriteEntity>
  ) {}

  public async addToFavorites(
    userId: string,
    offerId: string
  ): Promise<string> {

    const existing = await this.userOfferFavoriteModel.findOne({ userId, offerId }).exec();

    if (existing) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Offer ${offerId} is already in favorites for user ${userId}`,
        'userOfferFavoriteController'
      );
    }

    await this.userOfferFavoriteModel.create({ userId, offerId });

    this.logger.info(`Offer ${offerId} added to favorites by user ${userId}`);

    return 'Предложение добавлено в избранное';
  }

  public async removeFromFavorites(
    userId: string,
    offerId: string
  ): Promise<string> {
    const existing = await this.userOfferFavoriteModel.findOne({ userId, offerId }).exec();

    if (!existing) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Offer ${offerId} not found in favorites for user ${userId}`,
        'userOfferFavoriteController'
      );
    }

    await this.userOfferFavoriteModel.deleteOne({ _id: existing._id });

    this.logger.info(`Offer ${offerId} removed from favorites by user ${userId}`);

    return 'Оффер удален из избранного';
  }
}
