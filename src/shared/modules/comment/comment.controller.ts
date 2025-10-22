import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { BaseController, HttpError, HttpMethod } from '../../libs/express/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/common.js';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentRequest } from './request/create-comment-request.type.js';
import { Types } from 'mongoose';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
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
  }
}
