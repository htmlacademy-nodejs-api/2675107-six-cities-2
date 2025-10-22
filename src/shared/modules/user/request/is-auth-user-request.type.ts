import { Request } from 'express';
import { RequestParams } from '../../../libs/express/types/request.params.type.js';
import { RequestBody } from '../../../libs/express/types/request-body.type.js';

export type isAuthorizedUserRequest = Request<RequestParams, RequestBody>;
