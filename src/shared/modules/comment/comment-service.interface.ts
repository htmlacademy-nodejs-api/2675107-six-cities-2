import { CreateCommentDto } from './dto/create-comment.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';

export interface CommentService {
  create(dto: CreateCommentDto, offerId: string, userId: string): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string, userId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
