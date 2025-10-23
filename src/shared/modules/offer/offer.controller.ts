import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { BaseController, HttpError, HttpMethod } from '../../libs/express/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRdo } from './rdo/index-offer.rdo.js';
import { CreateOfferRequest } from './request/create-offer-request.type.js';
import { StatusCodes } from 'http-status-codes';
import { CommentService } from '../comment/comment-service.interface.js';
import { Types } from 'mongoose';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
    super(logger);

    this.logger.info('Register routes for CategoryController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.destroy });
  }

  public async index(
    req: Request,
    res: Response
  ): Promise<void> {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined;

    const offers = await this.offerService.find(limit, userId);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(
    req: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    const userId = req.query.userId;

    if (!userId || typeof userId !== 'string') {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User not UNAUTHORIZED.',
        'OfferController'
      );
    }
    const result = await this.offerService.create(req.body, userId);
    this.created(res, result);
  }

  public async show(
    req: Request,
    res: Response
  ): Promise<void> {
    const { offerId } = req.params;
    const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined;

    if(!offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'OfferId required params.',
        'OfferController'
      );
    }

    const result = await this.offerService.findById(offerId, userId);

    this.ok(res, result);
  }

  public async update(
    req: Request,
    res: Response
  ): Promise<void> {
    const { offerId } = req.params;
    const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined;

    if (!Types.ObjectId.isValid(offerId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Invalid offer ID format.',
        'OfferController'
      );
    }

    if(!userId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'UserId required params for update.',
        'OfferController'
      );
    }

    const result = await this.offerService.updateById(offerId, req.body, userId);

    this.ok(res, result);
  }

  public async destroy(
    req: Request,
    res: Response
  ): Promise<void> {
    const { offerId } = req.params;
    const userId = req.query.userId;

    if (!Types.ObjectId.isValid(offerId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Invalid offer ID format.',
        'OfferController'
      );
    }

    if(!Types.ObjectId.isValid(userId as string) || !userId) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'UserId required params for delete.',
        'OfferController'
      );
    }

    const result = await this.offerService.deleteById(offerId, userId as string);
    const destroyComment = await this.commentService.deleteByOfferId(offerId);

    this.ok(res, result + destroyComment);
  }
}
