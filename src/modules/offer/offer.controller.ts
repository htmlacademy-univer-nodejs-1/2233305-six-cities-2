import 'reflect-metadata';

import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.abstract.js';
import { fillDTO } from '../../common/helpers/common.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { DocumentExistsMiddleware } from '../../common/middleware/document-exists.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middleware/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../common/middleware/validate-objectid.middleware.js';
import { Component } from '../../types/component.enum.js';
import { HttpMethod } from '../../types/http.methods.enum.js';
import { ParamsCity, ParamsOffer, ParamsOffersCount } from '../../types/params.type.js';
import { CommentServiceInterface } from '../comments/comment-service.interface';
import { UserServiceInterface } from '../user/user-service.interface.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { FavoriteOfferShortDto } from './rdo/favorite-offer-short.dto.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import {PrivateRouteMiddleware} from '../../common/middleware/private-route.middleware.js';
import {ConfigInterface} from '../../common/config/config.interface.js';
import {ConfigSchema} from '../../common/config/config.schema.js';
import {UploadFileMiddleware} from '../../common/middleware/upload-file.middleware.js';
import UploadImageResponse from './rdo/upload-image.response.js';
import {RequestBody, RequestParams} from '../../common/http/requests.js';
import {HttpError} from '../../common/http/http.errors.js';
import {StatusCodes} from 'http-status-codes';
import {OfferShortRdo} from './rdo/offer-short.rdo.js';

@injectable()
export default class OfferController extends Controller {
  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface,
              @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
              @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
              @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
              @inject(Component.ConfigInterface) configService: ConfigInterface<ConfigSchema>
  ) {
    super(logger, configService);

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId')
      ]
    });

    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.showPremium
    });

    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Post,
      handler: this.addFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/users/favorites',
      method: HttpMethod.Get,
      handler: this.showFavorites,
      middlewares:[new PrivateRouteMiddleware()]
    });

    this.addRoute({
      path: '/:offerId/preview-image',
      method: HttpMethod.Post,
      handler: this.uploadPreviewImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'previewImage'),
      ]
    });
    this.addRoute({
      path: '/:offerId/image',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'image'),
      ]
    });
    this.addRoute({
      path: '/:offerId/image',
      method: HttpMethod.Delete,
      handler: this.removeImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'image'),
      ]
    });
  }

  public async index({params}: Request<ParamsOffersCount>, res: Response): Promise<void> {
    const offerCount = params.count ? parseInt(`${params.count}`, 10) : undefined;
    const offers = await this.offerService.find(offerCount);
    this.ok(res, fillDTO(OfferShortRdo, offers));
  }

  public async create({ body, user }: Request<RequestParams, RequestBody, CreateOfferDto>, res: Response): Promise<void> {
    const result = await this.offerService.create({ ...body, userId: user.id });
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async show({params}: Request<ParamsOffer>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update({params, body, user}: Request<ParamsOffer, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    if (offer?.userId.id !== user.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST,
        'Предложение было создано другим пользователем',
        'UpdateOffer');
    }
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, updatedOffer);
  }

  public async uploadPreviewImage(req: Request<ParamsOffer>, res: Response) {
    const offer = await this.offerService.findById(req.params.offerId);
    if (offer?.userId.id !== req.user.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST,
        'Предложение было создано другим пользователем',
        'DeleteOffer');
    }
    const {offerId} = req.params;
    const updateDto = { previewImage: req.file?.filename };
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImageResponse, {updateDto}));
  }

  public async uploadImage(req: Request<ParamsOffer>, res: Response) {
    const offer = await this.offerService.findById(req.params.offerId);
    if (offer?.userId.id !== req.user.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST,
        'Предложение было создано другим пользователем',
        'DeleteOffer');
    }
    const {offerId} = req.params;
    await this.offerService.addImage(offerId, req.file?.filename);
    this.noContent(res, offerId);
  }

  public async removeImage(req: Request<ParamsOffer>, res: Response) {
    const offer = await this.offerService.findById(req.params.offerId);
    if (offer?.userId.id !== req.user.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST,
        'Предложение было создано другим пользователем',
        'DeleteOffer');
    }
    const {offerId} = req.params;
    await this.offerService.removeImage(offerId, req.file?.filename);
    this.noContent(res, offerId);
  }

  public async delete({params, user}: Request<ParamsOffer>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    if (offer?.userId.id !== user.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST,
        'Предложение было создано другим пользователем',
        'DeleteOffer');
    }
    await this.offerService.deleteById(params.offerId);
    await this.commentService.deleteByOfferId(params.offerId);
    this.noContent(res, `Предложение ${params.offerId} было удалено.`);
  }

  public async showPremium({params}: Request<ParamsCity>, res: Response): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(params.city);
    this.ok(res, fillDTO(OfferShortRdo, offers));
  }

  public async showFavorites(req: Request, _res: Response): Promise<void> {
    const {user} = req;
    const offers = await this.userService.findFavorites(user.id);
    this.ok(_res, fillDTO(FavoriteOfferShortDto, offers));
  }

  public async addFavorite({ params, user }: Request<ParamsOffer>, res: Response): Promise<void> {
    await this.userService.addToFavoritesById(user.id, params.offerId);
    this.noContent(res, {message: 'Offer was added to favorite'});
  }

  public async deleteFavorite({ params, user }: Request<ParamsOffer>, res: Response): Promise<void> {
    await this.userService.removeFromFavoritesById(user.id, params.offerId);
    this.noContent(res, {message: 'Offer was removed from favorite'});
  }
}
