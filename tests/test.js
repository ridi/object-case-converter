/* global describe test expect beforeAll afterAll */

import { camelCase, snakeCase } from '../src/index';

const snakeCaseArray = [
  { id: '1', nick_name: 'nick1', contacts: [{ contact_type: 'phone', value: '000-000-000' }, { contact_type: 'email', value: 'test@email.com' }] },
  { id: '2', nick_name: 'nick2', contacts: [] },
  { id: '3', nick_name: 'nick3', contacts: [{ contact_type: 'address', value: 'xxx' }] },
];

const snakeCaseArrayShallow = [
  { id: '1', nick_name: 'nick1', contacts: [{ contactType: 'phone', value: '000-000-000' }, { contactType: 'email', value: 'test@email.com' }] },
  { id: '2', nick_name: 'nick2', contacts: [] },
  { id: '3', nick_name: 'nick3', contacts: [{ contactType: 'address', value: 'xxx' }] },
];

const camelCaseArray = [
  { id: '1', nickName: 'nick1', contacts: [{ contactType: 'phone', value: '000-000-000' }, { contactType: 'email', value: 'test@email.com' }] },
  { id: '2', nickName: 'nick2', contacts: [] },
  { id: '3', nickName: 'nick3', contacts: [{ contactType: 'address', value: 'xxx' }] },
];

const camelCaseArrayShallow = [
  { id: '1', nickName: 'nick1', contacts: [{ contact_type: 'phone', value: '000-000-000' }, { contact_type: 'email', value: 'test@email.com' }] },
  { id: '2', nickName: 'nick2', contacts: [] },
  { id: '3', nickName: 'nick3', contacts: [{ contact_type: 'address', value: 'xxx' }] },
];

const snakeCaseObject = {
  id: '1',
  nick_name: 'nick1',
  contacts: [{ contact_type: 'phone', value: '000-000-000' }, { contact_type: 'email', value: 'test@email.com' }],
  news_letter: { all_email: false, marketing_email: false },
};

const snakeCaseObjectShallow = {
  id: '1',
  nick_name: 'nick1',
  contacts: [{ contactType: 'phone', value: '000-000-000' }, { contactType: 'email', value: 'test@email.com' }],
  news_letter:{ allEmail: false, marketingEmail: false },
};

const camelCaseObject = {
  id: '1',
  nickName: 'nick1',
  contacts: [{ contactType: 'phone', value: '000-000-000' }, { contactType: 'email', value: 'test@email.com' }],
  newsLetter: { allEmail: false, marketingEmail: false },
};

const camelCaseObjectShallow = {
  id: '1',
  nickName: 'nick1',
  contacts: [{ contact_type: 'phone', value: '000-000-000' }, { contact_type: 'email', value: 'test@email.com' }],
  newsLetter: { all_email: false, marketing_email: false },
};

test('snake2camelObject', () => {
  expect(camelCase([])).toEqual([]);
  expect(camelCase({})).toEqual({});
  expect(camelCase(undefined)).toBe(undefined);
  expect(camelCase(null)).toBe(null);
  expect(camelCase(snakeCaseArray)).toEqual(camelCaseArrayShallow);
  expect(camelCase(snakeCaseObject)).toEqual(camelCaseObjectShallow);
  expect(camelCase(snakeCaseArray, true)).toEqual(camelCaseArray);
  expect(camelCase(snakeCaseObject, true)).toEqual(camelCaseObject);

  const date = new Date();
  expect(camelCase(date)).toBe(date);
});

test('camel2snakeObject', () => {
  expect(snakeCase([])).toEqual([]);
  expect(snakeCase({})).toEqual({});
  expect(snakeCase(undefined)).toBe(undefined);
  expect(snakeCase(null)).toBe(null);
  expect(snakeCase(camelCaseArray)).toEqual(snakeCaseArrayShallow);
  expect(snakeCase(camelCaseObject)).toEqual(snakeCaseObjectShallow);
  expect(snakeCase(camelCaseArray, true)).toEqual(snakeCaseArray);
  expect(snakeCase(camelCaseObject, true)).toEqual(snakeCaseObject);

  const date = new Date();
  expect(snakeCase(date)).toBe(date);
});
