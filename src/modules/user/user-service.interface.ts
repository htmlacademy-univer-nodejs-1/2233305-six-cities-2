import {DocumentType} from '@typegoose/typegoose';
import CreateUserDto from './dto/create-user.dto.js';
import {UserEntity} from './user.entity.js';
import {OfferEntity} from '../offer/offer.entity.js';
import LoginUserDto from './dto/login-user.dto.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>
  addToFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null>;
  removeFromFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null>;
}
