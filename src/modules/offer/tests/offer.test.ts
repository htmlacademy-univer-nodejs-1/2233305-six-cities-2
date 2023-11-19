import 'reflect-metadata';
import { afterAll, beforeAll, test } from 'vitest';

import { types } from '@typegoose/typegoose';
import express from 'express';
import { Server } from 'node:http';
import ConsoleLoggerService from '../../../common/logger/console.logger.service.js';
import { LoggerInterface } from '../../../common/logger/logger.interface.js';
import { Component } from '../../../types/component.enum.js';
import { CommentServiceInterface } from '../../comments/comment-service.interface.js';
import { CommentModel } from '../../comments/comment.entity.js';
import CommentService from '../../comments/comment.service.js';
import OfferController from '../../offer/offer.controller.js';
import MockUserService from '../../user/tests/mock.service.js';
import { UserServiceInterface } from '../../user/user-service.interface.js';
import { OfferServiceInterface } from '../offer-service.interface';
import { createOfferContainer } from '../offer.container';
import { OfferEntity } from '../offer.entity.js';
import MockConfigService from './mock.config.service.js';
import MockOfferService from './mock.offer.service.js';


const container = createOfferContainer();
container.bind<LoggerInterface>(Component.LoggerInterface).to(ConsoleLoggerService).inSingletonScope();
container.bind(Component.ConfigInterface).toConstantValue(new MockConfigService({SALT: 'SALT'}));
container.bind<UserServiceInterface>(Component.UserServiceInterface).to(MockUserService).inSingletonScope();
container.bind<CommentServiceInterface>(Component.CommentServiceInterface).to(CommentService).inSingletonScope();
container.bind<types.ModelType<OfferEntity>>(Component.CommentModel).toConstantValue(CommentModel);
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

