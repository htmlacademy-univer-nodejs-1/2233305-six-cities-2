import assert from 'node:assert';
import { Headers, fetch } from 'undici';
import { describe, test } from 'vitest';

process.env['E2E_ENDPOINT'] = 'http://localhost:4000';
assert(process.env['E2E_ENDPOINT'] !== undefined);
assert(process.env['E2E_ENDPOINT'].startsWith('http') === true, 'E2E_ENDPOINT должен начинаться с протокола');

const url = new URL(process.env['E2E_ENDPOINT']);

describe('POST /users/login', async () => {
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
      body: JSON.stringify({
        type: 'simple',
        email: 'test@test.com',
        username: 'name',
        password: '12345678910',
      })
    });

    const response = await fetch(new URL('/users/login', url), {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
      }),
      body: JSON.stringify(user)
    });

    tc.expect(response.ok).toBeTruthy();
    tc.expect(response.status).toStrictEqual(200);
    tc.expect(response.headers.get('content-type')).toMatch(/application\/json/);
    tc.expect(await response.json()).toMatchSnapshot();
  });
  test('Invalid password or email', async (tc) => {
    const user = {
      email: 'test@test.com',
      password: 'invalid',
    };

    const response = await fetch(new URL('/users/login', url), {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
      }),
      body: JSON.stringify(user)
    });

    tc.expect(response.ok).toBeFalsy();
    tc.expect(response.status).toStrictEqual(401);
    tc.expect(response.statusText).toStrictEqual('Unauthorized');
    tc.expect(response.headers.get('content-type')).toMatch(/application\/json/);
    tc.expect(await response.json()).toMatchSnapshot();
  });
});
