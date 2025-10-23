import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { CityName, Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { PipelineStage, Types } from 'mongoose';
import { CityService } from '../city/city-service.interface.js';
import { HttpError } from '../../libs/express/index.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CityService) private readonly cityService: CityService,
  ) {}

  public async create(dto: CreateOfferDto, userId: string): Promise<DocumentType<OfferEntity>> {

    const offerData = {
      ...dto,
      postDate: new Date(),
      userId: userId,
      rating: 0.0,
      commentsCount: 0,
    };

    const result = await this.offerModel.create(offerData);

    this.logger.info(`New offer created: ${dto.title}`);
    return result;
  }

  public async findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity>> {

    const offerObjId = new Types.ObjectId(offerId);

    const pipeline: PipelineStage[] = [
      { $match: { _id: offerObjId } }
    ];

    if (userId && Types.ObjectId.isValid(userId)) {
      const userObjId = new Types.ObjectId(userId);

      pipeline.push(
        {
          $lookup: {
            from: 'user-offer-favorite',
            let: { offerId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$offerId', '$$offerId'] },
                      { $eq: ['$userId', userObjId] }
                    ]
                  }
                }
              }
            ],
            as: 'favoriteInfo'
          }
        },
        {
          $addFields: {
            isFavorite: { $gt: [{ $size: '$favoriteInfo' }, 0] }
          }
        },
        {
          $project: { favoriteInfo: 0 }
        }
      );
    }

    const result = await this.offerModel.aggregate(pipeline).exec();

    if (!result || result.length === 0) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'OfferById not found.',
        'OfferController'
      );
    }
    const offer = result[0];

    this.logger.info(`Offer ${offer.title} show`);
    return offer;
  }

  public async find(limit?: number, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    const defaultLimit = 60;
    const finalLimit = limit && limit > 0 ? limit : defaultLimit;

    const pipeline: PipelineStage[] = [
      { $sort: { postDate: SortType.Down } },
      { $limit: finalLimit }
    ];

    if (userId) {
      if (Types.ObjectId.isValid(userId)) {
        const userObjId = new Types.ObjectId(userId);

        pipeline.push(
          {
            $lookup: {
              from: 'user-offer-favorite',
              let: { offerId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$offerId', '$$offerId'] },
                        { $eq: ['$userId', userObjId] }
                      ]
                    }
                  }
                }
              ],
              as: 'favoriteInfo'
            }
          },
          {
            $addFields: {
              isFavorite: { $gt: [{ $size: '$favoriteInfo' }, 0] }
            }
          },
          {
            $project: { favoriteInfo: 0 }
          }
        );
      }
    }

    const result = await this.offerModel.aggregate(pipeline).exec();

    this.logger.info(`Found ${result.length} offers`);
    return result;
  }


  public async deleteById(offerId: string, userId: string): Promise<string> {

    const offer = await this.offerModel.findById(offerId).exec();

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found for delete.',
        'OfferController'
      );
    }

    if (offer.userId.toString() !== userId.toString()) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You can only delete your own sentences.',
        'OfferController'
      );
    }

    await this.offerModel.findByIdAndDelete(offerId).exec();

    this.logger.info(`Offer with id ${offerId} deleted by user ${userId}`);

    return 'Предложение удалено ';

  }

  public async updateById(offerId: string, dto: UpdateOfferDto, userId: string): Promise<DocumentType<OfferEntity> | null> {

    const existingOffer = await this.offerModel.findById(offerId).exec();

    if (!existingOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer not found for UPDATE.',
        'OfferController'
      );
    }

    if (existingOffer.userId.toString() !== userId.toString()) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You can only edit your own sentences.',
        'OfferController'
      );
    }

    const updatedOffer = await this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['userId'])
      .exec();

    this.logger.info(`Offer ${offerId} successfully updated by user ${userId}`);
    return updatedOffer;
  }

  public async findPremiumOfferByCity(
    cityName: CityName,
    userId?: string
  ): Promise<DocumentType<OfferEntity>[]> {
    try {

      const city = await this.cityService.findByCityName(cityName);

      if (!city) {
        this.logger.warn(`City with name "${cityName}" not found`);
        return [];
      }

      const pipeline: PipelineStage[] = [
        { $match: { city: city.name, isPremium: true } },
        { $sort: { postDate: SortType.Down } },
        { $limit: 3 }
      ];

      if (userId) {
        pipeline.push(
          {
            $lookup: {
              from: 'user-offer-favorite',
              let: { offerId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$offerId', '$$offerId'] },
                        { $eq: ['$userId', new Types.ObjectId(userId)] }
                      ]
                    }
                  }
                }
              ],
              as: 'favoriteInfo'
            }
          },
          {
            $addFields: {
              isFavorite: { $gt: [{ $size: '$favoriteInfo' }, 0] }
            }
          }
        );
      }

      pipeline.push({
        $project: {
          _id: 1,
          title: 1,
          postDate: 1,
          city: 1,
          previewImage: 1,
          isPremium: 1,
          rating: 1,
          propertyType: 1,
          price: 1,
          commentsCount: 1,
          ...(userId ? { isFavorite: 1 } : {})
        }
      });

      const result = await this.offerModel.aggregate(pipeline).exec();

      this.logger.info(`Found ${result.length} premium offers for city "${cityName}"`);

      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to find premium offers for city "${cityName}": ${errorMessage}`);
      return [];
    }
  }

  public async findFavoriteOffer(
    userId: string
  ): Promise<DocumentType<OfferEntity>[]> {
    if (!userId) {
      this.logger.warn('Unauthorized access to favorite offers');
      return [];
    }

    const aggregation = this.offerModel.aggregate<DocumentType<OfferEntity>>([

      {
        $lookup: {
          from: 'user-offer-favorite',
          let: { offerId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$offerId', '$$offerId'] },
                    { $eq: ['$userId', new Types.ObjectId(userId)] },
                  ],
                },
              },
            },
          ],
          as: 'favoriteInfo',
        },
      },
      {
        $match: {
          favoriteInfo: { $ne: [] },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          postDate: 1,
          city: 1,
          previewImage: 1,
          isPremium: 1,
          rating: 1,
          propertyType: 1,
          price: 1,
          commentsCount: 1,
        },
      },
    ]);

    const result = await aggregation.exec();

    this.logger.info(`User ${userId} has ${result.length} favorite offers`);

    return result;
  }

  public async incCommentCountAndUpdateRating(offerId: string, newRating: number): Promise<DocumentType<OfferEntity> | null> {

    const offer = await this.offerModel.findById(offerId).exec();

    if (!offer) {
      throw new Error(`Offer with id ${offerId} not found`);
    }

    const oldRating = offer.rating ?? 0;

    const updatedRating = (oldRating + newRating) / 2;

    const updatedOffer = await this.offerModel.findByIdAndUpdate(
      offerId,
      {
        $inc: { commentsCount: 1 },
        $set: { rating: updatedRating },
      },
      { new: true }
    ).exec();

    return updatedOffer;
  }
}
