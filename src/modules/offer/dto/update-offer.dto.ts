import {CityEnum} from '../../../types/city.enum.js';
import {HousingType} from '../../../types/housing-type.enum.js';
import {Facilities} from '../../../types/facilities.enum.js';
import {CoordinatesType} from '../../../types/coordinates.type.js';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean, IsDateString,
  IsEnum,
  IsObject, IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';

export default class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, {message: 'Min length for name is 10'})
  @MaxLength(100, {message: 'Max length for name is 100'})
  public name?: string;

  @IsOptional()
  @MinLength(20, {message: 'Min length for description is 20'})
  @MaxLength(1024, {message: 'Max length for description is 1024'})
  public description?: string;

  @IsOptional()
  @IsEnum(CityEnum, {message: 'type must be one of the city'})
  public city?: CityEnum;

  @IsOptional()
  @IsString({message: 'preview path is required.'})
  public previewImage?: string;

  @IsOptional()
  @IsArray({message: 'field images must be an array'})
  @IsString({each: true, message: 'image path should be string'})
  public images?: string[];

  @IsOptional()
  @IsDateString({}, {message: 'postDate must be a valid ISO string'})
  public publicationDate!: Date;

  @IsOptional()
  @IsBoolean({message: 'field premium must be boolean'})
  public premium?: boolean;

  @IsOptional()
  @IsEnum(HousingType, {message: 'type must be one of the housing types'})
  public housingType?: HousingType;

  @IsOptional()
  @Min(1, {message: 'Min count of rooms is 1'})
  @Max(8, {message: 'Max count of rooms is 8'})
  public roomCount?: number;

  @IsOptional()
  @Min(1, {message: 'Min count of guests is 1'})
  @Max(10, {message: 'Max count of guests is 10'})
  public guestCount?: number;

  @IsOptional()
  @Min(100, {message: 'Min cost is 100'})
  @Max(100000, {message: 'Max cost is 100000'})
  public cost?: number;

  @IsOptional()
  @IsArray({message: 'field facilities must be an array'})
  @IsEnum(Facilities, {each: true, message: 'type must be one of the facilities'})
  @ArrayNotEmpty({message: 'There should be at least 1 facility'})
  public facilities?: Facilities[];

  @IsOptional()
  @IsObject({message: 'There should be object CoordinatesType'})
  public coordinates?: CoordinatesType;
}
