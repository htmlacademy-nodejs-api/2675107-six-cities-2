import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { BaseController, HttpMethod } from '../../libs/express/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for CategoryController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find(20, '68e386d2900a7f2da4ee6036');
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create(body, '68e386d2900a7f2da4ee6036');
    this.created(res, result);
  }
}
