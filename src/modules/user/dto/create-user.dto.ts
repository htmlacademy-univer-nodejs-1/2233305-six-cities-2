import {UserTypeEnum} from '../../../types/user-type.enum.js';

export default class CreateUserDto {
  public email!: string;
  public avatar?: string;
  public username!: string;
  public type!: UserTypeEnum;
  public password!: string;
}
