import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {Component} from '../../types/component.enum.js';
import {Controller} from '../../common/controller/controller.abstract.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http.methods.enum.js';
import {fillDTO} from '../../common/helpers/common.js';
import {OfferRdo} from './rdo/offer.rdo.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import {StatusCodes} from 'http-status-codes';
import {HttpError} from '../../common/http/http.errors.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {OfferServiceInterface} from './offer-service.interface.js';

@injectable()
export default class OfferController extends Controller {
  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface,
              @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/:offerId', method: HttpMethod.Get, handler: this.get});
    this.addRoute({path: '/:offerId', method: HttpMethod.Patch, handler: this.update});
    this.addRoute({path: '/:offerId', method: HttpMethod.Delete, handler: this.delete});
    this.addRoute({path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium});
  }

  public async index({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const limit = params.limit ? parseInt(`${params.limit}`, 10) : undefined;
    const offers = await this.offerService.find(limit);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {

    const result = await this.offerService.create(body);
    this.created(res, result);
  }

  public async get({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(`${params.offerId}`);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController',
      );
    }

    this.ok(res, offer);
  }

  public async update({params, body}: Request<Record<string, unknown>, Record<string, unknown>, UpdateOfferDto>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(`${params.offerId}`);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController',
      );
    }

    const updatedOffer = await this.offerService.updateById(`${params.offerId}`, body);
    this.ok(res, updatedOffer);
  }

  public async delete({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {

    await this.offerService.deleteById(`${params.offerId}`);
    this.noContent(res, `Offer ${params.offerId} was deleted.`);
  }

  public async getPremium({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const offer = await this.offerService.findPremiumByCity(`${params.city}`);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offers by city ${params.city} not found.`,
        'OfferController',
      );
    }

    this.ok(res, offer);
  }
}
