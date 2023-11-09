import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import CreateCommentDto from './dto/create-offer.dto.js';
import {CommentEntity} from './comment.entity.js';

export interface CommentServiceInterface {
  createForOffer(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
