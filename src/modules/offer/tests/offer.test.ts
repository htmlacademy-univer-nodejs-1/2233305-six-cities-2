import 'reflect-metadata';
import { afterAll, beforeAll, test } from 'vitest';

import express from 'express';
import { Server } from 'node:http';
import {createOfferContainer} from '../offer.container';
import {LoggerInterface} from '../../../common/logger/logger.interface.js';
import {Component} from '../../../types/component.enum.js';
import ConsoleLoggerService from '../../../common/logger/console.logger.service.js';
import MockConfigService from './mock.config.service.js';
import {OfferServiceInterface} from '../offer-service.interface';
import OfferController from '../../offer/offer.controller.js';
import MockOfferService from './mock.offer.service.js';


const container = createOfferContainer();
container.bind<LoggerInterface>(Component.LoggerInterface).to(ConsoleLoggerService).inSingletonScope();
container.bind(Component.ConfigInterface).toConstantValue(new MockConfigService({SALT: 'SALT'}));
container.rebind<OfferServiceInterface>(Component.OfferServiceInterface).to(MockOfferService).inSingletonScope();


const app = express();
app.use(express.json());
app.use(container.get<OfferController>(Component.OfferController).router);

let server: Server;
beforeAll(() => {
  server = app.listen();
});

afterAll(() => {
  server.close();
});

test('POST /', async () => void 1);

