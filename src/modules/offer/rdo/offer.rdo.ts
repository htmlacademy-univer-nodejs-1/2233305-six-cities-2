import { Expose } from 'class-transformer';
import {CityEnum} from '../../../types/city.enum.js';
import {HousingType} from '../../../types/housing-type.enum.js';

export class OfferRdo {
  @Expose()
    name!: string;

  @Expose()
    publicationDate!: Date;

  @Expose()
    city!: CityEnum;

  @Expose()
    previewImage!: string;

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
}
