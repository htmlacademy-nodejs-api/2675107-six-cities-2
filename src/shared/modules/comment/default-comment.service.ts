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

    const commentData = {
      ...dto,
      userId: userId,
      offerId: offerId,
    };

    const comment = await this.commentModel.create(commentData);

    return comment;
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .sort({ postDate: -1 })
      .limit(50)
      .populate(['userId'])
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<string> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    this.logger.info(`Комментарии для поста ${offerId} удаленны успешно`);
    return `Удаленно ${result.deletedCount} комментариев поста`;
  }

  public async exists(documentId: string): Promise<boolean> {
    if(!documentId) {
      return false;
    }
    const result = await this.commentModel.exists({ _id: documentId }).lean();
    return result !== null;
  }
}
