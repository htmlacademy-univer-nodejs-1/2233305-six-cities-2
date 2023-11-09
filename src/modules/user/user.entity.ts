import typegoose, {defaultClasses, getModelForClass} from '@typegoose/typegoose';
import {UserType} from '../../types/user.type.js';
import {UserTypeEnum} from '../../types/user-type.enum.js';
import {createSHA256} from '../../common/helpers/common.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements UserType {
  @prop({unique: true, required: true, match: [/^.+@.+$/, 'Email is incorrect']})
  public email: string;

  @prop({required: false, default: '', match: [/.*\.(?:jpg|png)/, 'Avatar must be jpg or png']})
  public avatar?: string;

  @prop({
    required: true,
    minlength: [1, 'Min length for username is 1'],
    maxlength: [15, 'Max length for username is 15']
  })
  public username: string;

  @prop({
    required: true,
    type: () => String,
    enum: UserTypeEnum
  })
  public type: UserTypeEnum;

  @prop({
    required: true,
    minlength: [6, 'Min length for password is 6'],
    maxlength: [12, 'Max length for password is 12']
  })
  public password?: string;

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
}

export const UserModel = getModelForClass(UserEntity);
