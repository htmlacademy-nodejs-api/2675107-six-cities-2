import { Request } from 'express';
import { RequestParams } from '../../../libs/express/types/request.params.type.js';
import { RequestBody } from '../../../libs/express/types/request-body.type.js';
import { CreateOfferDto } from '../dto/create-offer.dto.js';

export type CreateOfferRequest = Request<RequestParams, RequestBody, CreateOfferDto>;
