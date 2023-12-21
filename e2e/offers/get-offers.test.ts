import assert from 'node:assert';
import { Headers, fetch } from 'undici';
import { describe, test } from 'vitest';
import {CityEnum} from '../../src/types/city.enum.js';
import {HousingType} from '../../src/types/housing-type.enum.js';
import {Facilities} from '../../src/types/facilities.enum.js';
import LoggedUserRdo from '../../src/modules/user/rdo/logged-user.rdo.js';
import UserRdo from '../../src/modules/user/rdo/user.rdo.js';
import {OfferRdo} from '../../src/modules/offer/rdo/offer.rdo.js';

process.env['E2E_ENDPOINT'] = 'http://localhost:4000';
assert(process.env['E2E_ENDPOINT'] !== undefined);
assert(process.env['E2E_ENDPOINT'].startsWith('http') === true, 'E2E_ENDPOINT должен начинаться с протокола');

const url = new URL(process.env['E2E_ENDPOINT']);
const OFFERS_COUNT = 3;

describe('GET /offers', async () => {
  test('Success get offers empty', async (tc) => {
    const user = {
      email: 'test@test.com',
      password: '12345678910',
    };

    await fetch(new URL('/users/register', url), {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
      }),
      body: JSON.stringify({
        type: 'simple',
        email: 'test@test.com',
        username: 'name',
        password: '12345678910',
      })
    });

    const loginResponse = await fetch(new URL('/users/login', url), {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
      }),
      body: JSON.stringify(user)
    });

    const content: LoggedUserRdo = await loginResponse.json() as unknown as LoggedUserRdo;
    const response = await fetch(new URL('/offers', url), {
      method: 'GET',
      headers: new Headers({
        'content-type': 'application/json',
        'Authorization': `Bearer ${content.token}`
      })
    });

    tc.expect(response.ok).toBeTruthy();
    tc.expect(response.status).toStrictEqual(200);
    tc.expect(response.headers.get('content-type')).toMatch(/application\/json/);
    const responseJson = await response.json() as OfferRdo[];
    tc.expect(responseJson.length).toStrictEqual(0);
  });
  test('Success get offers', async (tc) => {
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
    for (let i = 0; i < OFFERS_COUNT; i++) {
      const offer = {
        name: `nametenlenght${i}`,
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
    }

    const response = await fetch(new URL('/offers', url), {
      method: 'GET',
      headers: new Headers({
        'content-type': 'application/json',
        'Authorization': `Bearer ${content.token}`
      })
    });

    tc.expect(response.ok).toBeTruthy();
    tc.expect(response.status).toStrictEqual(200);
    tc.expect(response.headers.get('content-type')).toMatch(/application\/json/);
    const responseJson = await response.json() as OfferRdo[];
    const res = responseJson.map((x) => {
      return {...x, id: 0, publicationDate: 31.01};
    });
    tc.expect(res).toMatchSnapshot();
    tc.expect(responseJson.length).toStrictEqual(OFFERS_COUNT);
  });

  test('Fail get offers [Unauthorized]', async (tc) => {
    const response = await fetch(new URL('/offers', url), {
      method: 'GET',
      headers: new Headers({
        'content-type': 'application/json',
        'Authorization': `Bearer ${123}`
      })
    });
    tc.expect(response.ok).toBeFalsy();
    tc.expect(response.status).toStrictEqual(401);
  });
});
