import 'reflect-metadata';
import { afterAll, beforeAll, test } from 'vitest';

import { types } from '@typegoose/typegoose';
import express from 'express';
import { Server } from 'node:http';
import { LoggerInterface } from '../../../common/logger/logger.interface.js';
import { Component } from '../../../types/component.enum.js';
import { CommentServiceInterface } from '../../comments/comment-service.interface.js';
import CommentService from '../../comments/comment.service.js';
import OfferController from '../../offer/offer.controller.js';
import { UserServiceInterface } from '../../user/user-service.interface.js';
import { OfferServiceInterface } from '../offer-service.interface';
import { createOfferContainer } from '../offer.container';
import MockOfferService from './mock.offer.service.js';
import MockConfigService from '../../user/tests/mock.config.service';
import MockUserService from '../../user/tests/mock.user.service';
import LoggerService from '../../../common/logger/logger.service.js';
import {CommentEntity, CommentModel} from '../../comments/comment.entity.js';


const container = createOfferContainer();
container.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
container.bind(Component.ConfigInterface).toConstantValue(new MockConfigService({SALT: 'SALT'}));
container.bind<UserServiceInterface>(Component.UserServiceInterface).to(MockUserService).inSingletonScope();
container.bind<CommentServiceInterface>(Component.CommentServiceInterface).to(CommentService).inSingletonScope();
container.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
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

