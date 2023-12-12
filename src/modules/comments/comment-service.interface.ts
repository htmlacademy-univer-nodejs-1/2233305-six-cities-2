import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import CreateCommentDto from './dto/create-comment.dto';
import {CommentEntity} from './comment.entity.js';

export interface CommentServiceInterface {
  createForOffer(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findById(commentId: string): Promise<DocumentType<CommentEntity> | null>
  deleteByOfferId(offerId: string): Promise<number | null>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>
}
