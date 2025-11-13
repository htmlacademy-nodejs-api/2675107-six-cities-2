import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { Logger } from '../../libs/logger/index.js';
import { CityName, Component } from '../../types/index.js';
import { BaseController, HttpMethod, UploadFileMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/express/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRdo } from './rdo/index-offer.rdo.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { UserOfferFavoriteService } from '../user-offer-favorite/user-offer-favorite-service.interface.js';
import { ParamOfferId } from './request/param-offerid.type.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { RequestParams } from '../../libs/express/types/request.params.type.js';
import { RequestBody } from '../../libs/express/types/request-body.type.js';
import { ParamCity } from './request/param-city.type.js';
import { QueryIndexOffer } from './request/query-index-offer.type.js';
import { DocumentExistsMiddleware } from '../../libs/express/middleware/document-exists.middleware.js';
import { AuthMiddleware } from '../../libs/express/middleware/auth.middleware.js';
import { ShowOfferRdo } from './rdo/show-offer.rdo.js';
import { Config } from '../../libs/config/config.interface.js';
import { RestSchema } from '../../libs/config/rest.schema.js';
import { UploadPreviewImageRdo } from './rdo/upload-preview-image.rdo.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserOfferFavoriteService) private readonly userOfferFavoriteService: UserOfferFavoriteService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({
      path: '/', method:
      HttpMethod.Get,
      handler: this.index,
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new AuthMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.indexPremiumCity,
    });
    this.addRoute({
      path: '/favorite',
      method: HttpMethod.Get,
      handler: this.indexFavorite,
      middlewares: [
        new AuthMiddleware(),
      ]
    });
    this.addRoute({
      path: '/favorite/:offerId',
      method: HttpMethod.Post,
      handler: this.createFavorite,
      middlewares: [
        new AuthMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/favorite/:offerId',
      method: HttpMethod.Delete,
      handler: this.destroyFavorite,
      middlewares: [
        new AuthMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId/previewImage',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new AuthMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'previewImage'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new AuthMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.destroy,
      middlewares: [
        new AuthMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  public async index(
    { query, tokenPayload }: Request<RequestParams, unknown, RequestBody, QueryIndexOffer>,
    res: Response
  ): Promise<void> {
    const limit = query.limit ? Number(query.limit) : undefined;
    const page = query.page ? Number(query.page) : undefined;
    const userId = tokenPayload?.id;

    const offers = await this.offerService.find(limit, page, userId);
    const responseData = fillDTO(OfferRdo, offers);

    this.ok(res, responseData);
  }

  public async create(
    { body, tokenPayload }: Request<RequestParams, unknown, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const userId = tokenPayload.id;

    const result = await this.offerService.create(body, userId);
    this.created(res, result.toObject());
  }

  public async show(
    { params, tokenPayload }: Request<ParamOfferId, unknown, RequestBody>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const userId = tokenPayload?.id;

    const result = await this.offerService.findById(offerId, userId);

    const responseData = fillDTO(ShowOfferRdo, result);

    this.ok(res, responseData);
  }

  public async update(
    { body, params, tokenPayload}: Request<ParamOfferId, unknown, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const userId = tokenPayload.id;

    const result = await this.offerService.updateById(offerId, body, userId);

    this.ok(res, result);
  }

  public async destroy(
    { params, tokenPayload}: Request<ParamOfferId, unknown, RequestBody>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const userId = tokenPayload.id;

    const result = await this.offerService.deleteById(offerId, userId);
    const destroyComment = await this.commentService.deleteByOfferId(offerId);

    this.ok(res, result + destroyComment);
  }

  public async indexPremiumCity (
    { params, tokenPayload }: Request<ParamCity, unknown, RequestBody>,
    res: Response
  ): Promise<void> {
    const { city } = params;
    const userId = tokenPayload?.id;

    const result = await this.offerService.findPremiumOfferByCity(city as CityName, userId);

    const responseData = fillDTO(OfferRdo, result);
    this.ok(res, responseData);
  }

  public async indexFavorite(
    { tokenPayload }: Request<RequestParams, unknown, RequestBody>,
    res: Response
  ): Promise<void> {
    const userId = tokenPayload.id;

    const result = await this.offerService.findFavoriteOffer(userId);

    const responseData = fillDTO(OfferRdo, result);
    this.ok(res, responseData);
  }

  public async createFavorite(
    { params, tokenPayload}: Request<ParamOfferId, unknown, RequestBody>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const userId = tokenPayload.id;

    const result = await this.userOfferFavoriteService.addToFavorites(userId, offerId);

    this.ok(res, result);
  }

  public async destroyFavorite(
    { params, tokenPayload}: Request<ParamOfferId, unknown, RequestBody>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const userId = tokenPayload.id;

    const result = await this.userOfferFavoriteService.removeFromFavorites(userId, offerId);

    this.ok(res, result);
  }

  public async uploadImage(req: Request, res: Response) {
    const { offerId } = req.params;
    const userId = req.tokenPayload.id;
    const filename = req.file?.filename;

    const updatedOffer = await this.offerService.updatePreviewImage(offerId, filename, userId);
    this.created(res, fillDTO(UploadPreviewImageRdo, { previewImage: updatedOffer.previewImage }));
  }
}
