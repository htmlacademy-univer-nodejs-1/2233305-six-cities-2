import {IsString, Length, Max, Min} from 'class-validator';

export default class CreateCommentDto {
  @IsString({message: 'text is required'})
  @Length(5, 1024, {message: 'Min length is 5, max is 1024'})
  public text!: string;

  public offerId!: string;

  public userId!: string;

  @Min(1, {message: 'Min value for rating is 1.'})
  @Max(5, {message: 'Max value for rating is 5.'})
  public rating!: number;
}
