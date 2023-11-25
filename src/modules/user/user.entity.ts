import typegoose, { defaultClasses, getModelForClass } from '@typegoose/typegoose';
import { createSHA256 } from '../../common/helpers/common.js';
import { UserTypeEnum } from '../../types/user-type.enum.js';
import { UserType } from '../../types/user.type.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements UserType {
  @prop({type: () => String, unique: true, required: true})
  public email: string;

  @prop({type: () => String, required: false, default: '', match: [/.*\.(?:jpg|png)/, 'Avatar must be jpg or png']})
  public avatar?: string;

  @prop({
    type: () => String,
    required: true,
    minlength: [1, 'Min length for username is 1'],
    maxlength: [15, 'Max length for username is 15']
  })
  public username: string;

  @prop({
    type: () => String,
    required: true,
    enum: UserTypeEnum
  })
  public type: UserTypeEnum;

  @prop({
    type: () => [String],
    required: true,
  })
  public favorite!: string[];

  @prop({
    type: () => String,
    required: true
  })
  private password?: string;

  constructor(userData: UserType) {
    super();

    this.email = userData.email;
    this.avatar = userData.avatar;
    this.username = userData.username;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
