import {CityEnum} from '../../../types/city.enum.js';
import {HousingType} from '../../../types/housing-type.enum.js';
import {Facilities} from '../../../types/facilities.enum.js';
import {CoordinatesType} from '../../../types/coordinates.type.js';
export class UpdateOfferDto {
  public name!: string;
  public description!: string;
  public publicationDate!: Date;
  public city!: CityEnum;
  public previewImage!: string;
  public images!: string[];
  public premium!: boolean;
  public favorite!: boolean;
  public rating!: number;
  public housingType!: HousingType;
  public roomCount!: number;
  public guestCount!: number;
  public cost!: number;
  public facilities!: Facilities[];
  public userId!: string;
  public commentsCount!: number;
  public coordinates!: CoordinatesType;
}
