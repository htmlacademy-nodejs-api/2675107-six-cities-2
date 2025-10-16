import { inject, injectable } from 'inversify';
import { CommentService } from './comment-service.interface.js';
import { Component } from '../../types/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { Logger } from '../../libs/logger/logger.interface.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,

  ) {}

  public async create(dto: CreateCommentDto, offerId: string, userId: string): Promise<DocumentType<CommentEntity>> {
    try {
      if (!offerId || !userId) {
        this.logger.warn(`OfferId ${offerId} or userId ${userId} not found`);
        throw new Error('You are not allowed to edit this offer');
      }
      const commentData = {
        ...dto,
        userId: userId,
        offerId: offerId,
      };

      const comment = await this.commentModel.create(commentData);

      return comment.populate(['userId', 'offerId']);
    } catch (error: unknown) {
      let errorMessage: string;

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'Unknown error';
      }

      this.logger.error(`Failed to create comment for offreId-${offerId} userId-${userId}: ${errorMessage}`);

      throw new Error(`Failed to create comment for offreId-${offerId} userId-${userId}: ${errorMessage}`);
    }
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .populate('userId');
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }
}
