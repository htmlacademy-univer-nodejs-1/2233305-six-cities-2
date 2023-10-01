import {FileReaderInterface} from './file-reader.interface.js';
import {readFileSync} from 'node:fs';
import {CityEnum} from '../types/city.enum';
import {HousingType} from '../types/housing-type.enum';
import {Facilities} from '../types/facilities.enum';
import {OfferType} from '../types/offer.type';
import {UserTypeEnum} from '../types/user-type.enum.js';

export default class TSVFileReader implements FileReaderInterface {
  private data = ' ';

  constructor(public filename: string) {
  }

  public read(): void {
    this.data = readFileSync(this.filename, {encoding: 'utf-8'});
  }

  public parseData(): OfferType[] {
    const offers = this.data?.split('\n').filter((row) => row.trim() !== '');
    const offersRows = offers?.map((row) => row.split('\t'));
    return offersRows.map(([name,
      description,
      publicationDate,
      city,
      previewImage,
      images,
      premium,
      favorite,
      rating,
      housingType,
      roomCount,
      guestCount,
      facilities,
      offerAuthorName,
      offerAuthorAvatar,
      offerAuthorType,
      offerAuthorEmail,
      offerAuthorPassword,
      commentsCount,
      latitude,
      longitude,
      price]) => ({
      name: name,
      description: description,
      publicationDate: new Date(publicationDate),
      city: city as unknown as CityEnum,
      previewImage: previewImage,
      images: images.split(','),
      premium: premium as unknown as boolean,
      favorite: favorite as unknown as boolean,
      rating: parseFloat(rating),
      housingType: housingType as unknown as HousingType,
      roomCount: parseInt(roomCount, 10),
      guestCount: parseInt(guestCount, 10),
      price: parseInt(price, 10),
      facilities: facilities.split(',').map((x) => x as unknown as Facilities),
      offerAuthor: {
        username: offerAuthorName,
        avatar: offerAuthorAvatar,
        type: offerAuthorType as unknown as UserTypeEnum,
        email: offerAuthorEmail,
        password: offerAuthorPassword
      },
      commentsCount: parseInt(commentsCount, 10),
      coordinates: {latitude: parseFloat(latitude), longitude: parseFloat(longitude)}
    }));
  }
}
