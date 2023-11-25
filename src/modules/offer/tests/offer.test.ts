import 'reflect-metadata';
import {afterAll, beforeAll, Mocked, test} from 'vitest';

import express from 'express';
import {Server} from 'node:http';
import {createOfferContainer} from '../offer.container';
import {LoggerInterface} from '../../../common/logger/logger.interface.js';
import {Component} from '../../../types/component.enum.js';
import ConsoleLoggerService from '../../../common/logger/console.logger.service.js';
import MockConfigService from '../../../common/config/mock.config.service';
import {OfferServiceInterface} from '../offer-service.interface';
import OfferController from '../../offer/offer.controller.js';
import MockOfferService from './mock.offer.service.js';
import UserService from '../../user/user.service.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {UserEntity, UserModel} from '../../user/user.entity.js';
import {CommentServiceInterface} from '../../comments/comment-service.interface.js';
import CommentService from '../../comments/comment.service.js';
import {CommentEntity, CommentModel} from '../../comments/comment.entity.js';
import {AddressInfo} from 'node:net';
import {fetch, Headers} from 'undici';
import {OfferEntity} from '../offer.entity';
import {HousingType} from '../../../types/housing-type.enum';
import {UserTypeEnum} from '../../../types/user-type.enum';
import {CityEnum} from '../../../types/city.enum';
import {Facilities} from '../../../types/facilities.enum';


const container = createOfferContainer();
container.bind<LoggerInterface>(Component.LoggerInterface).to(ConsoleLoggerService).inSingletonScope();
container.bind(Component.ConfigInterface).toConstantValue(new MockConfigService({SALT: 'SALT'}));
container.bind(Component.UserServiceInterface).to(UserService);
container.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
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

const offerEntity: OfferEntity[] = [new OfferEntity({
  name: 'name',
  premium: false,
  previewImage: 'image.png',
  rating: 0,
  commentsCount: 1,
  description: 'test',
  offerAuthor: {
    username: 'name',
    type: UserTypeEnum.simple,
    email: 'email@test.ru',
    avatar: 'avatar.jpg'
  },
  housingType: HousingType.House,
  city: CityEnum.Amsterdam,
  coordinates: {latitude: 2222.222, longitude: 21.22222},
  cost: 20000,
  guestCount: 2,
  facilities: [Facilities.AirConditioning],
  images: ['image.jpg', 'image.jpg', 'image.jpg', 'image.jpg', 'image.jpg', 'image.jpg'],
  roomCount: 1,
  publicationDate: new Date(),
  favorite: false
})];

test('GET /', async (tc) => {
  const {port} = server.address() as AddressInfo;
  const url = new URL('/?count=1', `http://0.0.0.0:${port}`);

  const srv = container.get<Mocked<OfferServiceInterface>>(Component.OfferServiceInterface);
  srv.find.mockImplementationOnce(async (count) => offerEntity.slice(0, count) as DocumentType<OfferEntity>[]);

  const response = await fetch(url, {
    method: 'GET',
    headers: new Headers([['content-type', 'application/json']])
  });

  const contentType = response.headers.get('content-type');

  tc.expect(response.ok).toBeTruthy();
  tc.expect(response.status).toBe(200);
  tc.expect(contentType?.startsWith('application/json')).toBeTruthy();

  const result = await response.json();

  tc.expect(result).toStrictEqual([{
    name: 'name',
    description: 'test',
    city: 'Amsterdam',
    previewImage: 'image.png',
    images: [
      'image.jpg',
      'image.jpg',
      'image.jpg',
      'image.jpg',
      'image.jpg',
      'image.jpg'
    ],
    premium: false,
    housingType: 'House',
    cost: 20000,
    roomCount: 1,
    guestCount: 2,
    facilities: [ 'AirConditioning' ],
    coordinates: { latitude: 2222.222, longitude: 21.22222 }
  }]);
});

