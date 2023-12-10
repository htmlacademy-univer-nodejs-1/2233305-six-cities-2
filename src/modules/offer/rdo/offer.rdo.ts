import {Expose, Type} from 'class-transformer';
import {CityEnum} from '../../../types/city.enum.js';
import {HousingType} from '../../../types/housing-type.enum.js';
import {Facilities} from '../../../types/facilities.enum.js';
import {UserType} from '../../../types/user.type.js';
import {CoordinatesType} from '../../../types/coordinates.type.js';
import UserRdo from '../../user/rdo/user.rdo.js';

export class OfferRdo {
  @Expose()
  public id!: string;

  @Expose()
    name!: string;

  @Expose({ name: 'createdAt'})
    publicationDate!: Date;

  @Expose()
    description!: string;

  @Expose()
    city!: CityEnum;

  @Expose()
    previewImage!: string;

  @Expose()
    images!: string[];

  @Expose()
    premium!: boolean;

  @Expose()
    favorite!: boolean;

  @Expose()
    rating!: number;

  @Expose()
    housingType!: HousingType;

  @Expose()
    cost!: number;

  @Expose()
    commentsCount!: number;

  @Expose()
    roomCount!: number;

  @Expose()
    guestCount!: number;

  @Expose()
    facilities!: Facilities[];

  @Expose({name: 'userId'})
  @Type(() => UserRdo)
    offerAuthor!: UserType;

  @Expose()
    coordinates!: CoordinatesType;
}
