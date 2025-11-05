import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpError, HttpMethod } from '../../libs/express/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { StatusCodes } from 'http-status-codes';
import { CommentService } from './comment-service.interface.js';
import { Types } from 'mongoose';
import { OfferService } from '../offer/offer-service.interface.js';
import { ParamOfferId } from '../offer/request/param-offerid.type.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { QueryUserId } from '../offer/request/query-userid.type.js';
import { RequestBody } from '../../libs/express/types/request-body.type.js';
import { fillDTO } from '../../helpers/common.js';
import { IndexCommentRdo } from './rdo/index-comment.rdo.js';


@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({ path: '/:offerId', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.index });
  }

  public async create(
    { body, params, query}: Request<ParamOfferId, unknown, CreateCommentDto, QueryUserId>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const userId = query.userId;

    if (!Types.ObjectId.isValid(offerId) || !offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Invalid offer ID format.',
        'CommentController'
      );
    }

    if(!Types.ObjectId.isValid(String(userId)) || !userId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'UserId required params.',
        'CommentController'
      );
    }

    const result = await this.commentService.create(body, offerId, String(userId));

    await this.offerService.incCommentCountAndUpdateRating(offerId, result.rating);

    this.created(res, result);
  }

  public async index(
    { params }: Request<ParamOfferId, unknown, RequestBody>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;

    if (!Types.ObjectId.isValid(offerId) || !offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Invalid offer ID format.',
        'CommentController'
      );
    }
    const result = await this.commentService.findByOfferId(offerId);

    const responseData = fillDTO(IndexCommentRdo, result);

    this.ok(res, responseData);
  }
}
