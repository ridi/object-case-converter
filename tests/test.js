/* global describe test expect beforeAll afterAll */

const converter = require('../src/index');

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
  expect(converter.camelCase([])).toEqual([]);
  expect(converter.camelCase({})).toEqual({});
  expect(converter.camelCase(undefined)).toBe(undefined);
  expect(converter.camelCase(null)).toBe(null);
  expect(converter.camelCase(snakeCaseArray)).toEqual(camelCaseArrayShallow);
  expect(converter.camelCase(snakeCaseObject)).toEqual(camelCaseObjectShallow);
  expect(converter.camelCase(snakeCaseArray, true)).toEqual(camelCaseArray);
  expect(converter.camelCase(snakeCaseObject, true)).toEqual(camelCaseObject);

  const date = new Date();
  expect(converter.camelCase(date)).toBe(date);
});

test('camel2snakeObject', () => {
  expect(converter.snakeCase([])).toEqual([]);
  expect(converter.snakeCase({})).toEqual({});
  expect(converter.snakeCase(undefined)).toBe(undefined);
  expect(converter.snakeCase(null)).toBe(null);
  expect(converter.snakeCase(camelCaseArray)).toEqual(snakeCaseArrayShallow);
  expect(converter.snakeCase(camelCaseObject)).toEqual(snakeCaseObjectShallow);
  expect(converter.snakeCase(camelCaseArray, true)).toEqual(snakeCaseArray);
  expect(converter.snakeCase(camelCaseObject, true)).toEqual(snakeCaseObject);

  const date = new Date();
  expect(converter.camelCase(date)).toBe(date);
});
