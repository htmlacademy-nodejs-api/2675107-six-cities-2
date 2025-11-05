import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { Logger } from '../../libs/logger/index.js';
import { CityName, Component } from '../../types/index.js';
import { BaseController, HttpError, HttpMethod, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/express/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRdo } from './rdo/index-offer.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { CommentService } from '../comment/comment-service.interface.js';
import { Types } from 'mongoose';
import { UserOfferFavoriteService } from '../user-offer-favorite/user-offer-favorite-service.interface.js';
import { ParamOfferId } from './request/param-offerid.type.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { QueryUserId } from './request/query-userid.type.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { RequestParams } from '../../libs/express/types/request.params.type.js';
import { RequestBody } from '../../libs/express/types/request-body.type.js';
import { ParamCity } from './request/param-city.type.js';
import { QueryIndexOffer } from './request/query-index-offer.type.js';
import { DocumentExistsMiddleware } from '../../libs/express/middleware/document-exists.middleware.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserOfferFavoriteService) private readonly userOfferFavoriteService: UserOfferFavoriteService,
  ) {
    super(logger);

    this.logger.info('Register routes for CategoryController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]
    });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.indexPremiumCity });
    this.addRoute({ path: '/favorite', method: HttpMethod.Get, handler: this.indexFavorite });
    this.addRoute({ path: '/favorite/:offerId', method: HttpMethod.Post, handler: this.createFavorite });
    this.addRoute({ path: '/favorite/:offerId', method: HttpMethod.Delete, handler: this.destroyFavorite });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.destroy });
  }

  public async index(
    { query }: Request<RequestParams, unknown, RequestBody, QueryIndexOffer>,
    res: Response
  ): Promise<void> {
    const limit = query.limit ? Number(query.limit) : undefined;
    const page = query.page ? Number(query.page) : undefined;
    const userId = query.userId ? String(query.userId) : undefined;

    const offers = await this.offerService.find(limit, page, userId);
    const responseData = fillDTO(OfferRdo, offers);

    console.log(offers);
    console.log(responseData);

    this.ok(res, responseData);
  }

  public async create(
    { body, query }: Request<RequestParams, unknown, CreateOfferDto, QueryUserId>,
    res: Response
  ): Promise<void> {
    const userId = query.userId;

    if(!Types.ObjectId.isValid(String(userId)) || !userId) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'To create posts you need to log in',
        'OfferController'
      );
    }

    const result = await this.offerService.create(body, String(userId));
    this.created(res, result);
  }

  public async show(
    { params, query}: Request<ParamOfferId, unknown, RequestBody, QueryUserId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const userId = query.userId ;

    if (!Types.ObjectId.isValid(offerId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Invalid offer ID format.',
        'OfferController'
      );
    }

    if(!Types.ObjectId.isValid(String(userId)) || !userId) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'UserId required params',
        'OfferController'
      );
    }

    const result = await this.offerService.findById(offerId, String(userId));

    this.ok(res, result);
  }

  public async update(
    { body, params, query}: Request<ParamOfferId, unknown, UpdateOfferDto, QueryUserId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const userId = query.userId;

    if (!Types.ObjectId.isValid(offerId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Invalid offer ID format.',
        'OfferController'
      );
    }

    if(!Types.ObjectId.isValid(String(userId)) || !userId) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'UserId required params.',
        'OfferController'
      );
    }

    const result = await this.offerService.updateById(offerId, body, String(userId));

    this.ok(res, result);
  }

  public async destroy(
    { params, query}: Request<ParamOfferId, unknown, RequestBody, QueryUserId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const userId = query.userId;

    if (!Types.ObjectId.isValid(offerId) || !offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Invalid offer ID format.',
        'OfferController'
      );
    }

    if(!Types.ObjectId.isValid(String(userId)) || !userId) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'UserId required params.',
        'OfferController'
      );
    }

    const result = await this.offerService.deleteById(offerId, String(userId));
    const destroyComment = await this.commentService.deleteByOfferId(offerId);

    this.ok(res, result + destroyComment);
  }

  public async indexPremiumCity (
    { params, query}: Request<ParamCity, unknown, RequestBody, QueryUserId>,
    res: Response
  ): Promise<void> {
    const { city } = params;
    const userId = query.userId ? String(query.userId) : undefined;

    if(!city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'cityName required params for find premium offer for city.',
        'OfferController'
      );
    }

    const result = await this.offerService.findPremiumOfferByCity(city as CityName, userId);

    const responseData = fillDTO(OfferRdo, result);
    this.ok(res, responseData);
  }

  public async indexFavorite(
    { query }: Request<RequestParams, unknown, RequestBody, QueryUserId>,
    res: Response
  ): Promise<void> {
    const userId = query.userId;

    if(!Types.ObjectId.isValid(String(userId)) || !userId) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'UserId required params for find favorite.',
        'OfferController'
      );
    }
    const result = await this.offerService.findFavoriteOffer(String(userId));

    const responseData = fillDTO(OfferRdo, result);
    this.ok(res, responseData);
  }

  public async createFavorite(
    { params, query}: Request<ParamOfferId, unknown, RequestBody, QueryUserId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const userId = query.userId;

    if (!Types.ObjectId.isValid(offerId) || !offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Invalid offer ID format.',
        'OfferController'
      );
    }

    if(!Types.ObjectId.isValid(String(userId)) || !userId) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'UserId required params.',
        'OfferController'
      );
    }

    const result = await this.userOfferFavoriteService.addToFavorites(String(userId), offerId);

    this.ok(res, result);
  }

  public async destroyFavorite(
    { params, query}: Request<ParamOfferId, unknown, RequestBody, QueryUserId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const userId = query.userId;

    if (!Types.ObjectId.isValid(offerId) || !offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Invalid offer ID format.',
        'OfferController'
      );
    }

    if(!Types.ObjectId.isValid(String(userId)) || !userId) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'UserId required params.',
        'OfferController'
      );
    }

    const result = await this.userOfferFavoriteService.removeFromFavorites(String(userId), offerId);

    this.ok(res, result);
  }
}
