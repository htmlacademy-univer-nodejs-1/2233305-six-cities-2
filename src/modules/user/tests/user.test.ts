import 'reflect-metadata';
import {afterAll, beforeAll, Mocked, test} from 'vitest';

import express from 'express';
import {Server} from 'node:http';
import {AddressInfo} from 'node:net';
import MockUserService from './mock.user.service.js';
import {fetch, Headers} from 'undici';
import {DocumentType} from '@typegoose/typegoose';
import {createUserContainer} from '../user.container.js';
import {LoggerInterface} from '../../../common/logger/logger.interface.js';
import {Component} from '../../../types/component.enum.js';
import ConsoleLoggerService from '../../../common/logger/console.logger.service.js';
import MockConfigService from '../../../common/config/mock.config.service.js';
import {UserServiceInterface} from '../user-service.interface.js';
import UserController from '../user.controller.js';
import {UserEntity} from '../user.entity.js';
import CreateUserDto from '../dto/create-user.dto.js';
import {UserTypeEnum} from '../../../types/user-type.enum.js';

const container = createUserContainer();
container.bind<LoggerInterface>(Component.LoggerInterface).to(ConsoleLoggerService).inSingletonScope();
container.bind(Component.ConfigInterface).toConstantValue(new MockConfigService({SALT: 'НеСыпьМнеСольНаРану'}));
container.rebind<UserServiceInterface>(Component.UserServiceInterface).to(MockUserService).inSingletonScope();

const app = express();
app.use(express.json());
app.use(container.get<UserController>(Component.UserController).router);

let server: Server;
beforeAll(() => {
  server = app.listen();
});

afterAll(() => {
  server.close();
});

test('POST /register', async (tc) => {
  const {port} = server.address() as AddressInfo;
  const url = new URL('/register', `http://0.0.0.0:${port}`);

  const srv = container.get<Mocked<UserServiceInterface>>(Component.UserServiceInterface);
  srv.create.mockImplementationOnce(async (dto) => new UserEntity(dto) as DocumentType<UserEntity>);

  const response = await fetch(url, {
    method: 'POST',
    headers: new Headers([['content-type', 'application/json']]),
    body: JSON.stringify({
      username: 'name',
      email: 'test@email.com',
      type: UserTypeEnum.simple,
      password: 'myPassword',
    } satisfies CreateUserDto)
  });

  const contentType = response.headers.get('content-type');

  tc.expect(response.ok).toBeTruthy();
  tc.expect(response.status).toBe(201); // created
  tc.expect(contentType?.startsWith('application/json')).toBeTruthy();

  const result = await response.json();

  tc.expect(result).toStrictEqual({
    username: 'name',
    email: 'test@email.com',
    type: 'simple'
  });
});

