import { Request } from 'express';
import { RequestParams } from '../../../libs/express/types/request.params.type.js';
import { RequestBody } from '../../../libs/express/types/request-body.type.js';
import { LoginUserDto } from '../dto/login-user.dto.js';

export type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDto>;
