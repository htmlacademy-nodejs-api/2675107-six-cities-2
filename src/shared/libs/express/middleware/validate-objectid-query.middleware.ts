import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';

export class ValidateObjectIdQueryMiddleware implements Middleware {
  constructor(private queryParam: string) {}

  public execute({ query }: Request, _res: Response, next: NextFunction): void {
    const objectId = query[this.queryParam];

    if (!objectId) {
      return next();
    }

    if (!Types.ObjectId.isValid(objectId as string)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `${objectId} is invalid ObjectID in query parameter`,
        'ValidateObjectIdQueryMiddleware'
      );
    }

    return next();
  }
}
