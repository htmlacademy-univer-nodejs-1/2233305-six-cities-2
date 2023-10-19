import {generateRandomValue, getRandomItem, getRandomItems} from '../common/helpers/random.js';
import {MockData} from '../types/mock-data.type';
import {OfferGeneratorInterface} from './offer-generator.interface.js';
import dayjs from 'dayjs';
import {CityEnum} from '../types/city.enum.js';
import {HousingType} from '../types/housing-type.enum.js';
import {Facilities} from '../types/facilities.enum.js';
import {UserTypeEnum} from '../types/user-type.enum.js';
import {
  FIRST_WEEK_DAY,
  LAST_WEEK_DAY, MAX_COST, MAX_COUNT,
  MAX_COUNT_ROOM,
  MAX_RATING, MIN_COST, MIN_COUNT,
  MIN_COUNT_ROOM,
  MIN_RATING
} from '../common/helpers/consts.js';

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {
  }

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.names);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publicationDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const city = getRandomItem([CityEnum.Amsterdam, CityEnum.Cologne, CityEnum.Brussels, CityEnum.Paris, CityEnum.Hamburg, CityEnum.Dusseldorf]);
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const images = getRandomItems<string>(this.mockData.images);
    const premium = getRandomItem<string>(['true', 'false']);
    const favorite = getRandomItem<string>(['true', 'false']);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const housingType = getRandomItem([HousingType.House, HousingType.Hotel, HousingType.Room, HousingType.Apartment]);
    const roomCount = generateRandomValue(MIN_COUNT_ROOM, MAX_COUNT_ROOM);
    const guestCount = generateRandomValue(MIN_COUNT, MAX_COUNT);
    const cost = generateRandomValue(MIN_COST, MAX_COST);
    const facilities = getRandomItems([Facilities.AirConditioning, Facilities.BabySeat, Facilities.Fridge]);
    const offerAuthorName = getRandomItem<string>(this.mockData.users.usernames);
    const offerAuthorAvatar = getRandomItem<string>(this.mockData.users.avatars);
    const offerAuthorType = getRandomItem([UserTypeEnum.pro, UserTypeEnum.simple]);
    const offerAuthorNameEmail = getRandomItem<string>(this.mockData.users.emails);
    const commentsCount = generateRandomValue(MIN_COUNT, MAX_COUNT);
    const latitude = getRandomItem<number>(this.mockData.coordinates.latitude);
    const longitude = getRandomItem<number>(this.mockData.coordinates.longitude);

    return [
      name, description, publicationDate,
      city, previewImage, images, premium,
      favorite, rating, housingType, roomCount,
      guestCount, cost, facilities, offerAuthorName,
      offerAuthorAvatar, offerAuthorType, offerAuthorNameEmail,
      commentsCount, latitude, longitude
    ].join('\t');
  }
}
