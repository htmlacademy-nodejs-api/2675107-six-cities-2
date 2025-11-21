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
import { DEFAULT_OFFER_FILE_NAME } from './offer.constant.js';
import path from 'node:path';
import fs from 'node:fs';

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
      previewImage: DEFAULT_OFFER_FILE_NAME,
      photos: [DEFAULT_OFFER_FILE_NAME],
      userId: userId,
      rating: 0.0,
      commentsCount: 0,
    };

    const result = await this.offerModel.create(offerData);

    await result.populate('userId');

    this.logger.info(`New offer created: ${result}`);
    return result;
  }

  public async findById(offerId: string, currentUserId?: string): Promise<DocumentType<OfferEntity> | null> {
    const pipeline: PipelineStage[] = [
      { $match: { _id: new Types.ObjectId(offerId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' }
    ];

    if (currentUserId) {
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
                      { $eq: ['$userId', new Types.ObjectId(currentUserId)] }
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
        { $project: { favoriteInfo: 0 } }
      );
    }

    const result = await this.offerModel.aggregate(pipeline).exec();
    const offer = result[0];

    if (!offer) {
      return null;
    }

    const formattedOffer = {
      ...offer,
      id: offer._id.toString(),
      userId: {
        id: offer.user._id.toString(),
        firstname: offer.user.firstname,
        email: offer.user.email,
        avatarPath: offer.user.avatarPath,
        userType: offer.user.userType,
      },
    };

    delete formattedOffer.user;

    this.logger.info(`Offer ${formattedOffer.title} show`);

    return formattedOffer;
  }


  public async find(limit?: number, page?: number, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    const DEFAULT_LIMIT = 60;
    const finalLimit = limit && limit > 0 ? limit : DEFAULT_LIMIT;

    const finalPage = page && page > 0 ? page : 1;
    const skip = (finalPage - 1) * finalLimit;

    const pipeline: PipelineStage[] = [
      { $sort: { postDate: SortType.Down } },
      { $skip: skip },
      { $limit: finalLimit }
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
        },
        {
          $project: { favoriteInfo: 0 }
        }
      );
    }

    const result = await this.offerModel.aggregate(pipeline).exec();

    this.logger.info(`Found ${result.length} offers (page: ${finalPage})`);
    return result;
  }


  public async deleteById(offerId: string, userId: string): Promise<string> {

    const existingOffer = await this.offerModel.findById(offerId).exec();

    this.existsEntity(existingOffer);

    this.compareUsers(existingOffer.userId.toString(), userId.toString());

    await this.offerModel.findByIdAndDelete(offerId).exec();

    this.logger.info(`Offer with id ${offerId} deleted by user ${userId}`);

    return 'Предложение удалено ';

  }

  public async updateById(offerId: string, dto: Partial<UpdateOfferDto>, userId: string): Promise<DocumentType<OfferEntity> | null> {

    const existingOffer = await this.offerModel.findById(offerId).exec();

    this.existsEntity(existingOffer);

    this.compareUsers(existingOffer.userId.toString(), userId.toString());

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

    const city = await this.cityService.findByCityName(cityName);

    this.existsEntity(city);

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
        },
        {
          $project: { favoriteInfo: 0 }
        }
      );
    }

    const result = await this.offerModel.aggregate(pipeline).exec();

    this.logger.info(`Found ${result.length} premium offers for city "${cityName}"`);

    return result;

  }

  public async findFavoriteOffer(
    userId: string
  ): Promise<DocumentType<OfferEntity>[]> {

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
        $addFields: {
          isFavorite: { $gt: [{ $size: '$favoriteInfo' }, 0] }
        }
      },
      {
        $project: { favoriteInfo: 0 }
      }
    ]);

    const result = await aggregation.exec();

    this.logger.info(`User ${userId} has ${result.length} favorite offers`);

    return result;
  }

  public async incCommentCountAndUpdateRating(offerId: string, newRating: number): Promise<DocumentType<OfferEntity> | null> {

    const offer = await this.offerModel.findById(offerId).exec();

    this.existsEntity(offer);

    if(newRating > 5) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'The value cannot be greater than 5.',
        'CommentController'
      );
    }

    const oldRating = offer.rating ?? 0;
    const oldCount = offer.commentsCount ?? 0;

    const updatedRating = (oldRating * oldCount + newRating) / (oldCount + 1);

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

  public async exists(documentId: string): Promise<boolean> {
    if(!documentId) {
      return false;
    }
    const result = await this.offerModel.exists({ _id: documentId }).lean();
    return result !== null;
  }

  public async updatePreviewImage(
    offerId: string,
    newFilepath: string,
    userId: string
  ): Promise<DocumentType<OfferEntity>> {

    const offer = await this.offerModel.findById(offerId).exec();
    this.existsEntity(offer);
    this.compareUsers(offer.userId.toString(), userId.toString());

    if (offer.previewImage) {
      const relativePath = offer.previewImage.startsWith('/upload/')
        ? `.${offer.previewImage}`
        : `./upload/${offer.previewImage}`;

      const oldPath = path.resolve(relativePath);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    offer.previewImage = newFilepath;
    await offer.save();

    this.logger.info(`Offer ${offerId} updated preview image by user ${userId}`);
    return offer;
  }

  public async updatePhotos(
    offerId: string,
    newFilepaths: string[],
    userId: string
  ): Promise<DocumentType<OfferEntity>> {

    const offer = await this.offerModel.findById(offerId).exec();
    this.existsEntity(offer);
    this.compareUsers(offer.userId.toString(), userId.toString());

    if (offer.photos && offer.photos.length > 0) {
      for (const old of offer.photos) {
        const relativePath = old.startsWith('/upload/')
          ? `.${old}`
          : `./upload/${old}`;
        const oldPath = path.resolve(relativePath);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    offer.photos = newFilepaths;
    await offer.save();

    this.logger.info(`Offer ${offerId} updated photos by user ${userId}`);
    return offer;
  }

  public compareUsers(
    offerUserId: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ): void {
    if (offerUserId !== userId) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You can only edit your own sentences.',
        'OfferController'
      );
    }
  }

  public existsEntity<T>(entity: T | null): asserts entity is T {
    if (!entity) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Entity not found.',
        'OfferController'
      );
    }
  }
}
