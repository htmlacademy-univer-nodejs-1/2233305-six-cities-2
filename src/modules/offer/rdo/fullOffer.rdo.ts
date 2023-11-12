import { Expose } from 'class-transformer';
import {CityEnum} from '../../../types/city.enum.js';
import {HousingType} from '../../../types/housing-type.enum.js';
import {Facilities} from '../../../types/facilities.enum.js';
import {UserType} from '../../../types/user.type.js';
import {CoordinatesType} from '../../../types/coordinates.type.js';

export class FullOfferRdo {
  @Expose()
    name!: string;

  @Expose()
    description!: string;

  @Expose()
    publicationDate!: Date;

  @Expose()
    city!: CityEnum;

  @Expose()
    previewImage!: string;

  @Expose()
    images!: string[];

  @Expose()
    premium!: boolean;

  @Expose()
    favorite = true;

  @Expose()
    rating!: number;

  @Expose()
    housingType!: HousingType;

  @Expose()
    roomCount!: number;

  @Expose()
    guestCount!: number;

  @Expose()
    cost!: number;

  @Expose()
    facilities!: Facilities[];

  @Expose()
    offerAuthor!: UserType;

  @Expose()
    commentsCount!: number;

  @Expose()
    coordinates!: CoordinatesType;
}
