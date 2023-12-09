import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';
import {CommentServiceInterface} from './comment-service.interface.js';
import {Component} from '../../types/component.enum.js';
import {CommentEntity} from './comment.entity';
import CreateCommentDto from './dto/create-comment.dto';
import {OfferServiceInterface} from '../offer/offer-service.interface.js';
import {SortType} from '../../types/sort-type.enum.js';

const COMMENTS_COUNT = 50;
@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface
  ) {
  }

  public async createForOffer(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    const offerId = dto.offerId;
    await this.offerService.incComment(offerId);

    const offer = await this.offerService.findById(offerId);

    const count = offer?.commentsCount ?? 1;
    const rating = offer?.rating ?? 0;
    const newRating = (rating + dto.rating) / (count);
    await this.offerService.updateRating(offerId, newRating);
    return comment;
  }


  public findById(commentId: string): Promise<DocumentType<CommentEntity> | null> {
    return this.commentModel
      .findById(commentId)
      .populate('userId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .sort({createdAt: SortType.Down})
      .populate('userId')
      .limit(COMMENTS_COUNT);
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }
}
