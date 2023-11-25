import typegoose, { defaultClasses, getModelForClass, mongoose, Ref, Severity } from '@typegoose/typegoose';
import { CityEnum } from '../../types/city.enum.js';
import { CoordinatesType } from '../../types/coordinates.type.js';
import { Facilities } from '../../types/facilities.enum.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { UserEntity } from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface OfferEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    type: () => String,
    required: true,
    enum: CityEnum
  })
  public city!: CityEnum;

  @prop({type: () => Number, default: 0})
  public commentsCount!: number;

  @prop({
    type: () => Number,
    required: true,
    min: [100, 'Min cost is 100'],
    max: [100000, 'Max cost is 100000']
  })
  public cost!: number;

  @prop({
    type: () => String,
    required: true,
    trim: true,
    minlength: [20, 'Min length for description is 20'],
    maxlength: [1024, 'Max length for description is 1024']
  })
  public description!: string;

  @prop({
    type: () => String,
    required: true,
    enum: Facilities
  })
  public facilities!: Facilities[];

  @prop({
    type: () => Number,
    required: true, min: [1, 'Min count of guests is 1'],
    max: [10, 'Max count of guests is 10']
  })
  public guestCount!: number;

  @prop({
    type: () => String,
    required: true,
    enum: HousingType
  })
  public housingType!: HousingType;

  @prop({
    type: () => [String],
    minCount: [6, 'Images should be 6'],
    maxCount: [6, 'Images should be 6']
  })
  public images!: string[];

  @prop({
    type: () => String,
    required: true,
    trim: true,
    minlength: [10, 'Min length for name is 10'],
    maxlength: [100, 'Max length for name is 15']
  })
  public name!: string;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({type: () => Boolean, required: true, default: false})
  public premium!: boolean;

  @prop({type: () => String})
  public previewImage!: string;

  @prop({type: () => Date})
  public publicationDate!: Date;

  @prop({
    type: () => Number,
    default: 1,
    min: [1, 'Min rating is 1'],
    max: [5, 'Max rating is 5']
  })
  public rating!: number;

  @prop({
    type: () => Number,
    required: true, min: [1, 'Min room count is 1'],
    max: [8, 'Max room count is 8']
  })
  public roomCount!: number;

  @prop({
    type: () => mongoose.Schema.Types.Mixed,
    required: true,
    allowMixed: Severity.ALLOW
  })
  public coordinates!: CoordinatesType;
}

export const OfferModel = getModelForClass(OfferEntity);
