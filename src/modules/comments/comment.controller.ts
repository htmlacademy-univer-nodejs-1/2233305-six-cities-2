import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.abstract.js';
import {Component} from '../../types/component.enum.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {CommentServiceInterface} from './comment-service.interface.js';
import {HttpMethod} from '../../types/http.methods.enum.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import {fillDTO} from '../../common/helpers/common.js';
import CommentRdo from './rdo/comment.rdo.js';
import {ValidateDtoMiddleware} from '../../common/middleware/validate-dto.middleware.js';
import {DocumentExistsMiddleware} from '../../common/middleware/document-exists.middleware.js';
import {OfferServiceInterface} from '../offer/offer-service.interface.js';
import {PrivateRouteMiddleware} from '../../common/middleware/private-route.middleware.js';
import {ParamsOffer} from '../../types/params.type.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  public async create({body, params, user}: Request<ParamsOffer>, res: Response): Promise<void> {
    const comment = await this.commentService.createForOffer(
      {
        ...body, offerId:
        params.offerId, userId:
        user.id
      }
    );
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
