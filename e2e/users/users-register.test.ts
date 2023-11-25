import assert from 'node:assert';
import { Headers, fetch } from 'undici';
import { describe, test } from 'vitest';

process.env['E2E_ENDPOINT'] = 'http://localhost:4000';
assert(process.env['E2E_ENDPOINT'] !== undefined);
assert(process.env['E2E_ENDPOINT'].startsWith('http') === true, 'E2E_ENDPOINT должен начинаться с протокола');

const url = new URL(process.env['E2E_ENDPOINT']);

describe('POST /users/register', async () => {
  test('Success user register', async (tc) => {
    const user = {
      type: 'simple',
      email: 'test@test.com',
      username: 'name',
      password: '12345678910',
    };

    const response = await fetch(new URL('/users/register', url), {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
      }),
      body: JSON.stringify(user)
    });

    tc.expect(response.ok).toBeTruthy();
    tc.expect(response.status).toStrictEqual(201);
    tc.expect(response.headers.get('content-type')).toMatch(/application\/json/);
    tc.expect(await response.json()).toMatchSnapshot();

    const responseWhenUserExist = await fetch(new URL('/users/register', url), {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
      }),
      body: JSON.stringify(user)
    });

    tc.expect(responseWhenUserExist.ok).toBeFalsy();
    tc.expect(responseWhenUserExist.status).toStrictEqual(409);
    tc.expect(responseWhenUserExist.statusText).toStrictEqual('Conflict');
    tc.expect(responseWhenUserExist.headers.get('content-type')).toMatch(/application\/json/);
    tc.expect(await responseWhenUserExist.json()).toMatchSnapshot();
  });

  test('Invalid email', async (tc) => {
    const user = {
      type: 'simple',
      email: 'invalid',
      username: 'test',
      password: '12345678910',
    };

    const response = await fetch(new URL('/users/register', url), {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
      }),
      body: JSON.stringify(user)
    });

    tc.expect(response.ok).toBeFalsy();
    tc.expect(response.status).toStrictEqual(400);
    tc.expect(response.statusText).toStrictEqual('Bad Request');
    tc.expect(response.headers.get('content-type')).toMatch(/application\/json/);
    tc.expect(await response.json()).toMatchSnapshot();
  });
});
