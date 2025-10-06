import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CreateUserOfferFavoriteDto } from './dto/create-user-offer-favorite.dto.js';
import { UserOfferFavoriteService } from './user-offer-favorite-service.interface.js';
import { UserOfferFavoriteEntity } from './user-offer-favorite.entity.js';

@injectable()
export class DefaultUserOfferFavoriteService implements UserOfferFavoriteService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserOfferFavoriteModel) private readonly userOfferFavoriteModel: types.ModelType<UserOfferFavoriteEntity>
  ) {}

  public async create(dto: CreateUserOfferFavoriteDto): Promise<DocumentType<UserOfferFavoriteEntity>> {
    const result = await this.userOfferFavoriteModel.create(dto);
    this.logger.info('New favorite offer created');

    return result;
  }

  public async findById(userOfferFavoriteId: string): Promise<DocumentType<UserOfferFavoriteEntity> | null> {
    return this.userOfferFavoriteModel.findById(userOfferFavoriteId).exec();
  }

  public async findByUserAndOffer(userId: string, offerId: string): Promise<DocumentType<UserOfferFavoriteEntity> | null> {
    return this.userOfferFavoriteModel.findOne({
      userId: userId,
      offerId: offerId
    }).exec();
  }

  public async createIfNotExists(dto: CreateUserOfferFavoriteDto): Promise<DocumentType<UserOfferFavoriteEntity> | null> {
    const existing = await this.findByUserAndOffer(
      dto.userId.toString(),
      dto.offerId.toString()
    );

    if (existing) {
      return null;
    }

    return this.create(dto);
  }
}
