import assert from 'node:assert';
import { Headers, fetch } from 'undici';
import { describe, test } from 'vitest';
import {CityEnum} from '../../src/types/city.enum.js';
import {HousingType} from '../../src/types/housing-type.enum.js';
import {Facilities} from '../../src/types/facilities.enum.js';
import LoggedUserRdo from '../../src/modules/user/rdo/logged-user.rdo.js';
import UserRdo from '../../src/modules/user/rdo/user.rdo.js';
import {OfferRdo} from '../../src/modules/offer/rdo/offer.rdo.js';
import {FavoriteOfferShortDto} from '../../src/modules/offer/rdo/favorite-offer-short.dto';

process.env['E2E_ENDPOINT'] = 'http://localhost:4000';
assert(process.env['E2E_ENDPOINT'] !== undefined);
assert(process.env['E2E_ENDPOINT'].startsWith('http') === true, 'E2E_ENDPOINT должен начинаться с протокола');

const url = new URL(process.env['E2E_ENDPOINT']);

describe('GET /offers/favorites', async () => {
  test('Success get favorite offers after delete', async (tc) => {
    const user = {
      email: 'test1@test.com',
      password: '12345678910',
    };

    const registerResponse = await fetch(new URL('/users/register', url), {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
      }),
      body: JSON.stringify({
        type: 'simple',
        email: 'test1@test.com',
        username: 'name1',
        password: '12345678910',
      })
    });

    const userRdo = await registerResponse.json() as unknown as UserRdo;
    const loginResponse = await fetch(new URL('/users/login', url), {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
      }),
      body: JSON.stringify(user)
    });

    const content: LoggedUserRdo = await loginResponse.json() as unknown as LoggedUserRdo;
    const offer = {
      name: 'nametenlenght',
      description: 'descriptiontwentylenght',
      city: CityEnum.Amsterdam,
      premium: true,
      housingType: HousingType.House,
      roomCount: 2,
      guestCount: 3,
      cost: 10000,
      facilities: [Facilities.AirConditioning],
      userId: '',
      coordinates: {latitude: 2.22222, longitude: 3.444444}
    };

    const createResponse = await fetch(new URL('/offers', url), {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'Authorization': `Bearer ${content.token}`
      }),
      body: JSON.stringify({...offer, userId: userRdo.id})
    });

    tc.expect(createResponse.ok).toBeTruthy();
    const offerRdo = await createResponse.json() as OfferRdo;

    const addToFavoriteResponse = await fetch(new URL(`/offers/favorites/${offerRdo.id}`, url), {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'Authorization': `Bearer ${content.token}`
      })
    });

    tc.expect(addToFavoriteResponse.ok).toBeTruthy();
    tc.expect(addToFavoriteResponse.status).toStrictEqual(204);


    const removeFavoriteResponse = await fetch(new URL(`/offers/favorites/${offerRdo.id}`, url), {
      method: 'DELETE',
      headers: new Headers({
        'content-type': 'application/json',
        'Authorization': `Bearer ${content.token}`
      })
    });
    tc.expect(removeFavoriteResponse.ok).toBeTruthy();
    tc.expect(removeFavoriteResponse.status).toStrictEqual(204);

    const getFavoriteAfterDeleteResponse = await fetch(new URL('/offers/users/favorites', url), {
      method: 'GET',
      headers: new Headers({
        'content-type': 'application/json',
        'Authorization': `Bearer ${content.token}`
      })
    });

    tc.expect(getFavoriteAfterDeleteResponse.ok).toBeTruthy();
    tc.expect(getFavoriteAfterDeleteResponse.status).toStrictEqual(200);
    tc.expect(getFavoriteAfterDeleteResponse.headers.get('content-type')).toMatch(/application\/json/);
    const favoriteOfferRdo = await getFavoriteAfterDeleteResponse.json() as FavoriteOfferShortDto[];
    const res = favoriteOfferRdo.map((x) => ({...x, id: 0}));
    tc.expect(res).toMatchSnapshot();
  });
});
