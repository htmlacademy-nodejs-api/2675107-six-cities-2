import { Request } from 'express';
import { RequestParams } from '../../../libs/express/types/request.params.type.js';
import { RequestBody } from '../../../libs/express/types/request-body.type.js';
import { CreateCommentDto } from '../dto/create-comment.dto.js';

export type CreateCommentRequest = Request<RequestParams, RequestBody, CreateCommentDto>;
