import assert from 'node:assert';
import { Headers, fetch } from 'undici';
import { describe, test } from 'vitest';
import LoggedUserRdo from '../../src/modules/user/rdo/logged-user.rdo.js';

process.env['E2E_ENDPOINT'] = 'http://localhost:4000';
assert(process.env['E2E_ENDPOINT'] !== undefined);
assert(process.env['E2E_ENDPOINT'].startsWith('http') === true, 'E2E_ENDPOINT должен начинаться с протокола');

const url = new URL(process.env['E2E_ENDPOINT']);

describe('GET /users/login', async () => {
  test('Success user login', async (tc) => {
    const user = {
      email: 'test@test.com',
      password: '12345678910',
    };

    await fetch(new URL('/users/register', url), {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
      }),
      body: JSON.stringify({...user,
        type: 'simple',
        username: 'name'
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

    const response = await fetch(new URL('/users/login', url), {
      method: 'GET',
      headers: new Headers({
        'content-type': 'application/json',
        'Authorization': `Bearer ${content.token}`
      }),
    });

    tc.expect(response.ok).toBeTruthy();
    tc.expect(response.status).toStrictEqual(200);
    tc.expect(response.headers.get('content-type')).toMatch(/application\/json/);
    tc.expect(await response.json()).toMatchSnapshot();
  });
});
