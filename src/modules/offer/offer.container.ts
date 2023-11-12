import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import OfferService from './offer.service.js';
import {OfferEntity, OfferModel} from './offer.entity.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {Component} from '../../types/component.enum.js';
import {Controller} from '../../common/controller/controller.abstract.js';
import OfferController from './offer.controller.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferServiceInterface>(Component.OfferServiceInterface).to(OfferService);
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<Controller>(Component.OfferController).to(OfferController).inSingletonScope();

  return offerContainer;
}
