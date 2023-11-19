import 'reflect-metadata';

import { types } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.enum.js';
import { OfferEntity } from '../offer/offer.entity.js';
import CreateUserDto from './dto/create-user.dto.js';
import { UserServiceInterface } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';

@injectable()
export default class UserService implements UserServiceInterface {

  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {
  }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({...dto, avatar: ''});
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(dto);
    this.logger.info(`New user was created: ${user.email}`);

    return result;
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.userModel.findById(userId).select('favorite');
    if (!offers) {
      return [];
    }

    return this.userModel
      .find({_id: { $in: offers.favorite }});
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({'_id': userId});
  }

  public addToFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null> {
    return this.userModel.findByIdAndUpdate(userId, {$push: {favorite: offerId}, new: true});
  }

  public removeFromFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null> {
    return this.userModel.findByIdAndUpdate(userId, {$pull: {favorite: offerId}, new: true});
  }
}
