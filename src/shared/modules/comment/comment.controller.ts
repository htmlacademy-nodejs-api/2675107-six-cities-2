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
  }

  public async create(
    { body, params, query}: Request<ParamOfferId, unknown, CreateCommentDto, QueryUserId>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const userId = String(query.userId);

    if (!Types.ObjectId.isValid(offerId) || !offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Invalid offer ID format.',
        'CommentController'
      );
    }

    if(!Types.ObjectId.isValid(userId) || !userId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'UserId required params for update.',
        'CommentController'
      );
    }

    const result = await this.commentService.create(body, offerId, userId);

    await this.offerService.incCommentCountAndUpdateRating(offerId, result.rating);

    this.created(res, result);
  }
}
