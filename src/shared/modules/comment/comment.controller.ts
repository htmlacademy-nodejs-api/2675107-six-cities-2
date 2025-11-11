import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod, ValidateObjectIdMiddleware } from '../../libs/express/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CommentService } from './comment-service.interface.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { ParamOfferId } from '../offer/request/param-offerid.type.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { RequestBody } from '../../libs/express/types/request-body.type.js';
import { fillDTO } from '../../helpers/common.js';
import { IndexCommentRdo } from './rdo/index-comment.rdo.js';
import { DocumentExistsMiddleware } from '../../libs/express/middleware/document-exists.middleware.js';
import { AuthMiddleware } from '../../libs/express/middleware/auth.middleware.js';


@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new AuthMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  public async create(
    { body, params, tokenPayload}: Request<ParamOfferId, unknown, CreateCommentDto>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;

    const result = await this.commentService.create(body, offerId, tokenPayload.id);

    await this.offerService.incCommentCountAndUpdateRating(offerId, result.rating);

    this.created(res, result);
  }

  public async index(
    { params }: Request<ParamOfferId, unknown, RequestBody>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;

    const result = await this.commentService.findByOfferId(offerId);

    const responseData = fillDTO(IndexCommentRdo, result);

    this.ok(res, responseData);
  }
}
