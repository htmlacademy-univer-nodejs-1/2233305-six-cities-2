import {generateRandomValue, getRandomItem, getRandomItems} from '../helpers/random.js';
import {MockData} from '../types/mock-data.type';
import {OfferGeneratorInterface} from './offer-generator.interface.js';
import dayjs from 'dayjs';
import {CityEnum} from '../types/city.enum.js';
import {HousingType} from '../types/housing-type.enum.js';
import {Facilities} from '../types/facilities.enum.js';
import {UserTypeEnum} from '../types/user-type.enum.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;
const MIN_RATING = 1;
const MAX_RATING = 5;
const MIN_COUNT = 1;
const MAX_COUNT = 10;
const MIN_COUNT_ROOM = 1;
const MAX_COUNT_ROOM = 8;
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

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
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const facilities = getRandomItems([Facilities.AirConditioning, Facilities.BabySeat, Facilities.Fridge]);
    const offerAuthorName = getRandomItem<string>(this.mockData.users.usernames);
    const offerAuthorAvatar = getRandomItem<string>(this.mockData.users.avatars);
    const offerAuthorType = getRandomItem([UserTypeEnum.pro, UserTypeEnum.simple]);
    const offerAuthorNameEmail = getRandomItem<string>(this.mockData.users.emails);
    const offerAuthorNamePassword = getRandomItem<string>(this.mockData.users.passwords);
    const commentsCount = generateRandomValue(MIN_COUNT, MAX_COUNT);
    const latitude = getRandomItem<number>(this.mockData.coordinates.latitude);
    const longitude = getRandomItem<number>(this.mockData.coordinates.longitude);

    return [
      name, description, publicationDate,
      city, previewImage, images, premium,
      favorite, rating, housingType, roomCount,
      guestCount, price, facilities, offerAuthorName,
      offerAuthorAvatar, offerAuthorType, offerAuthorNameEmail,
      offerAuthorNamePassword, commentsCount, latitude, longitude
    ].join('\t');
  }
}
