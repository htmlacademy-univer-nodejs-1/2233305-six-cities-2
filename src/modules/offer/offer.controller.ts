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
import { CreateOfferRequest } from './type/create-offer.request.js';

@injectable()
export default class OfferController extends Controller {
  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface,
              @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
              @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
              @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface
  ) {
    super(logger);

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
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteFavorite,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.showFavorites
    });
  }

  public async index({params}: Request<ParamsOffersCount>, res: Response): Promise<void> {
    const offerCount = params.count ? parseInt(`${params.count}`, 10) : undefined;
    const offers = await this.offerService.find(offerCount);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create({body}: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, result);
  }

  public async show({params}: Request<ParamsOffer>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update({params, body}: Request<ParamsOffer, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, updatedOffer);
  }

  public async delete({params}: Request<ParamsOffer>, res: Response): Promise<void> {
    await this.offerService.deleteById(params.offerId);
    await this.commentService.deleteByOfferId(params.offerId);
    this.noContent(res, `Предложение ${params.offerId} было удалено.`);
  }

  public async showPremium({params}: Request<ParamsCity>, res: Response): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(params.city);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async showFavorites({body}: Request<Record<string, unknown>, Record<string, unknown>, {
    userId: string
  }>, _res: Response): Promise<void> {
    const offers = await this.userService.findFavorites(body.userId);
    this.ok(_res, fillDTO(FavoriteOfferShortDto, offers));
  }

  public async addFavorite({body}: Request<Record<string, unknown>, Record<string, unknown>, {
    offerId: string,
    userId: string
  }>, res: Response): Promise<void> {
    await this.userService.addToFavoritesById(body.offerId, body.userId);
    this.noContent(res, {message: 'Offer was added to favorite'});
  }

  public async deleteFavorite({body}: Request<Record<string, unknown>, Record<string, unknown>, {
    offerId: string,
    userId: string
  }>, res: Response): Promise<void> {
    await this.userService.removeFromFavoritesById(body.offerId, body.userId);
    this.noContent(res, {message: 'Offer was removed from favorite'});
  }
}
