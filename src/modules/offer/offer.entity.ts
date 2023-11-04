import typegoose, {defaultClasses, getModelForClass, Ref, Severity} from '@typegoose/typegoose';
import {CityEnum} from '../../types/city.enum.js';
import {Facilities} from '../../types/facilities.enum.js';
import {HousingType} from '../../types/housing-type.enum.js';
import {UserEntity} from '../user/user.entity.js';
import {CoordinatesType} from '../../types/coordinates.type.js';

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
    required: true,
    type: () => String,
    enum: CityEnum
  })
  public city!: CityEnum;

  @prop({default: 0})
  public commentsCount!: number;

  @prop()
  public cost!: number;

  @prop({
    required: true,
    minlength: [20, 'Min length for description is 20'],
    maxlength: [1024, 'Max length for description is 1024']
  })
  public description!: string;

  @prop({
    required: true,
    type: () => String,
    enum: Facilities
  })
  public facilities!: Facilities[];

  @prop({required: true, default: false})
  public favorite!: boolean;

  @prop({
    required: true, min: [1, 'Min count of guests is 1'],
    max: [10, 'Max count of guests is 10']
  })
  public guestCount!: number;

  @prop({
    required: true,
    type: () => String,
    enum: HousingType
  })
  public housingType!: HousingType;

  @prop({type: String, allowMixed: Severity.ALLOW})
  public images!: string[];

  @prop({
    required: true,
    minlength: [10, 'Min length for name is 10'],
    maxlength: [100, 'Max length for name is 15']
  })
  public name!: string;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({required: true, default: false})
  public premium!: boolean;

  @prop({required: true, match: [/.*\.(?:jpg|png)/, 'Image must be jpg or png']})
  public previewImage!: string;

  @prop({required: true})
  public publicationDate!: Date;

  @prop({
    required: true, min: [1, 'Min rating is 1'],
    max: [5, 'Max rating is 5']
  })
  public rating!: number;

  @prop({
    required: true, min: [1, 'Min room count is 1'],
    max: [8, 'Max room count is 8']
  })
  public roomCount!: number;

  @prop({
    required: true,
    allowMixed: Severity.ALLOW
  })
  public coordinates!: CoordinatesType;
}

export const OfferModel = getModelForClass(OfferEntity);
