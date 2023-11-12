import {Expose} from 'class-transformer';

export default class UserRdo {
  @Expose()
  public username!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatar!: string;
}
