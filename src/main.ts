import 'reflect-metadata';
import {Component} from './types/component.enum.js';
import Application from './app/application.js';
import {Container} from 'inversify';
import {createUserContainer} from './modules/user/user.container.js';
import {createApplicationContainer} from './app/api.container.js';
import {createOfferContainer} from './modules/offer/offer.container.js';

const mainContainer = Container.merge(createApplicationContainer(),
  createUserContainer(),
  createOfferContainer());
const application = mainContainer.get<Application>(Component.Application);
await application.init();
