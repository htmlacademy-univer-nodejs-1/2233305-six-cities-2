import {OfferType} from '../types/offer.type';
import {HousingType} from '../types/housing-type.enum';
import {Facilities} from '../types/facilities.enum';
import {UserTypeEnum} from '../types/user-type.enum';
import {CityEnum} from '../types/city.enum';
export function createOffer(offer: string): OfferType {
  const offerRow = offer.replace('\n', '').split('\t');
  const [name,
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
    cost,
    facilities,
    offerAuthorName,
    offerAuthorAvatar,
    offerAuthorType,
    offerAuthorEmail,
    offerAuthorPassword,
    commentsCount,
    latitude,
    longitude] = offerRow;
  return {
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
    cost: parseInt(cost, 10),
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
  };
}
