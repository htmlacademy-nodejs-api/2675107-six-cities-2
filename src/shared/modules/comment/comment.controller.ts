import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { BaseController, HttpError, HttpMethod } from '../../libs/express/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { StatusCodes } from 'http-status-codes';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentRequest } from './request/create-comment-request.type.js';
import { Types } from 'mongoose';
import { OfferService } from '../offer/offer-service.interface.js';

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
    req: CreateCommentRequest,
    res: Response,
  ): Promise<void> {
    const { offerId } = req.params;
    const userId = req.query.userId;

    if (!Types.ObjectId.isValid(offerId as string) || !offerId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Invalid offer ID format.',
        'CommentController'
      );
    }

    if(!Types.ObjectId.isValid(userId as string) || !userId) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'UserId required params for update.',
        'CommentController'
      );
    }

    const result = await this.commentService.create(req.body, offerId as string, userId as string);

    if(result.rating > 5) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'The value cannot be greater than 5.',
        'CommentController'
      );
    }
    await this.offerService.incCommentCountAndUpdateRating(offerId as string, result.rating);

    this.created(res, result);
  }
}
