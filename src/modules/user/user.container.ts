import {Container} from 'inversify';
import {UserServiceInterface} from './user-service.interface.js';
import UserService from './user.service.js';
import {Component} from '../../types/component.enum.js';
import {UserEntity, UserModel} from './user.entity.js';
import {types} from '@typegoose/typegoose';
import {Controller} from '../../common/controller/controller.abstract.js';
import UserController from './user.controller.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  userContainer.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();

  return userContainer;
}
