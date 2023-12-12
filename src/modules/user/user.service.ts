import 'reflect-metadata';
import {DocumentType, types} from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.enum.js';
import { OfferEntity } from '../offer/offer.entity.js';
import CreateUserDto from './dto/create-user.dto.js';
import { UserServiceInterface } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import LoginUserDto from './dto/login-user.dto.js';
import UpdateUserDto from './dto/update-user.dto.js';
import {DEFAULT_AVATAR_FILE_NAME} from '../../common/helpers/consts.js';

@injectable()
export default class UserService implements UserServiceInterface {

  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {
  }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({...dto, avatar: DEFAULT_AVATAR_FILE_NAME});
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user was created: ${user.email}`);

    return result;
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.userModel.findById(userId).select('favorite');
    if (!offers) {
      return [];
    }

    return this.offerModel
      .find({_id: { $in: offers.favorite }}).populate('userId');
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

  public async verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (! user) {
      return null;
    }

    if (user.verifyPassword(dto.password, salt)) {
      return user;
    }

    return null;
  }

  public async addToFavoritesById(userId: string, offerId: string): Promise<void> {
    await this.userModel.updateOne(
      {_id: userId},
      { $addToSet: { favorite: offerId } }
    );
  }

  public async removeFromFavoritesById(userId: string, offerId: string): Promise<void> {
    await this.userModel.updateOne(
      {_id: userId},
      { $pull: { favorite: offerId } }
    );
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, {new: true})
      .exec();
  }
}
