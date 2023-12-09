import {IsOptional} from 'class-validator';

export default class UpdateUserDto {
  @IsOptional()
  public email?: string;

  @IsOptional()
  public username?: string;

  @IsOptional()
  public avatar?: string;
}
