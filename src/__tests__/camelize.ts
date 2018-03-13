import {
  camelCase,
  snakeCase,
  kebabCase,
  upperFirst,
} from 'lodash-es'

import { camelize, decamelize } from '../camelize'

describe('Basic types', () => {
  it('null', () => {
    expect(camelize(undefined)).toEqual(undefined)
    expect(camelize(null)).toEqual(null)
  })
  it('string', () => {
    expect(camelize('abc-def')).toEqual('abc-def')
  })
  it('boolean', () => {
    expect(camelize(false)).toEqual(false)
    expect(camelize(true)).toEqual(true)
  })
  it('empty object', () => {
    expect(camelize([])).toEqual([])
    expect(camelize({})).toEqual({})
  })
  it('Date', () => {
    const date = new Date()
    expect(camelize(date)).toEqual(date)
  })
  it('RegExp', () => {
    const regex = new RegExp('.+', 'g')
    expect(camelize(regex)).toEqual(regex)
  })
})


const snakeCaseArray = [
  { id: '1', nick_name: 'nick1', contacts: [{ contact_type: 'phone', value: '000-000-000' }, { contact_type: 'email', value: 'test@email.com' }] },
  { id: '2', nick_name: 'nick2', contacts: [] },
  { id: '3', nick_name: 'nick3', contacts: [{ contact_type: 'address', value: 'xxx' }] },
]

const snakeCaseArrayShallow = [
  { id: '1', nick_name: 'nick1', contacts: [{ contactType: 'phone', value: '000-000-000' }, { contactType: 'email', value: 'test@email.com' }] },
  { id: '2', nick_name: 'nick2', contacts: [] },
  { id: '3', nick_name: 'nick3', contacts: [{ contactType: 'address', value: 'xxx' }] },
]

const camelCaseArray = [
  { id: '1', nickName: 'nick1', contacts: [{ contactType: 'phone', value: '000-000-000' }, { contactType: 'email', value: 'test@email.com' }] },
  { id: '2', nickName: 'nick2', contacts: [] },
  { id: '3', nickName: 'nick3', contacts: [{ contactType: 'address', value: 'xxx' }] },
]

const camelCaseArrayShallow = [
  { id: '1', nickName: 'nick1', contacts: [{ contact_type: 'phone', value: '000-000-000' }, { contact_type: 'email', value: 'test@email.com' }] },
  { id: '2', nickName: 'nick2', contacts: [] },
  { id: '3', nickName: 'nick3', contacts: [{ contact_type: 'address', value: 'xxx' }] },
]

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

describe('Shallow (default)', () => {
  it('camelize array', () => {
    expect(camelize(snakeCaseArray)).toEqual(camelCaseArrayShallow)
  })
  it('camelize object', () => {
    expect(camelize(snakeCaseObject)).toEqual(camelCaseObjectShallow)
  })
  it('decamelize array', () => {
    expect(decamelize(camelCaseArray)).toEqual(snakeCaseArrayShallow)
  })
  it('decamelize object', () => {
    expect(decamelize(camelCaseObject)).toEqual(snakeCaseObjectShallow)
  })
})

describe('Recursive option', () => {
  it('camelize array', () => {
    expect(camelize(snakeCaseArray, { recursive: true })).toEqual(camelCaseArray)
  })
  it('camelize object', () => {
    expect(camelize(snakeCaseObject, { recursive: true })).toEqual(camelCaseObject)
  })
  it('decamelize array', () => {
    expect(decamelize(camelCaseArray, { recursive: true })).toEqual(snakeCaseArray)
  })
  it('decamelize object', () => {
    expect(decamelize(camelCaseObject, { recursive: true })).toEqual(snakeCaseObject)
  })
})


const result = {
  FOO: {
    foo_bar: '',
  },
  foo_baz: [
    { baz_foo: '' },
    { baz_foo: '' },
  ],
  bar_baz: false,
  baz_foo: {
    FOO: '',
  },
}

describe('Specific recursive', () => {
  it('recursive: true with exclude', () => {
    expect(camelize(result, { excludes: ['FOO'], recursive: true })).toEqual({ FOO: { foo_bar: '' }, fooBaz: [{ bazFoo: '' }, { bazFoo: '' }], barBaz: false, bazFoo: { FOO: '' } })
  })
  it('negative recursive', () => {
    expect(camelize(result, { recursive: { excludes: ['FOO'] } })).toEqual({ foo: { foo_bar: '' }, fooBaz: [{ bazFoo: '' }, { bazFoo: '' }], barBaz: false, bazFoo: { foo: '' } })
  })
  it('excludes with negative recursive', () => {
    expect(camelize(result, { excludes: ['bar_baz'], recursive: { excludes: ['FOO'] } })).toEqual({ foo: { foo_bar: '' }, fooBaz: [{ bazFoo: '' }, { bazFoo: '' }], bar_baz: false, bazFoo: { foo: '' } })
  })
})

describe('Inherit excludes', () => {
  it('recursive: true & excludes: string[]', () => {
    expect(camelize(result, { excludes: ['FOO'], recursive: true }))
      .toEqual(camelize(result, { excludes: ['FOO'], recursive: { excludes: ['FOO'] } }))
  })
  it('recursive: { excludes: string[] } & excludes: string[]', () => {
    expect(camelize(result, { excludes: ['FOO'], recursive: { excludes: ['foo_baz'] } }))
      .toEqual(camelize(result, { excludes: ['FOO'], recursive: { excludes: ['foo_baz', 'FOO'] } }))
  })
})


const allCase = {
  camelFooBar: '',
  snake_foo_bar: '',
  'kebab-foo-bar': '',
  PascalFooBar: '',
  CONSTANT_FOO_BAR: '',
  'String? \"\'\t foo bar': '',
}

describe('All cases', () => {
  it('camelize', () => {
    expect(camelize(allCase)).toEqual({ camelFooBar: '', snakeFooBar: '', kebabFooBar: '', pascalFooBar: '', constantFooBar: '', stringFooBar: '' })
  })
  it('decamelize', () => {
    expect(decamelize(allCase)).toEqual({ camel_foo_bar: '', snake_foo_bar: '', 'kebab-foo-bar': '', PascalFooBar: '', CONSTANT_FOO_BAR: '', 'String? \"\'\t foo bar': '' })
  })
  it('force decamelize', () => {
    expect(decamelize(allCase, { force: true })).toEqual({ camel_foo_bar: '', snake_foo_bar: '', kebab_foo_bar: '', pascal_foo_bar: '', constant_foo_bar: '', string_foo_bar: '' })
  })
})

describe('Excludes/Exception', () => {
  it('excludes string[]', () => {
    expect(camelize(allCase, { excludes: ['CONSTANT_FOO_BAR', 'snake_foo_bar'] })).toEqual({camelFooBar: '', snake_foo_bar: '', kebabFooBar: '', pascalFooBar: '', 'CONSTANT_FOO_BAR': '', stringFooBar: '' })
  })
  it('excludes RegExp', () => {
    expect(camelize(allCase, { excludes: /^[A-Z_]+$/ })).toEqual({camelFooBar: '', snakeFooBar: '', kebabFooBar: '', pascalFooBar: '', 'CONSTANT_FOO_BAR': '', stringFooBar: '' })
  })
  it('excludes function', () => {
    expect(camelize(allCase, { excludes: key => {
      if (key === 'CONSTANT_FOO_BAR') {
        return true
      } else if (key.includes('ke')) {
        return true
      }
      return false
    } })).toEqual({camelFooBar: '', snake_foo_bar: '', 'kebab-foo-bar': '', pascalFooBar: '', 'CONSTANT_FOO_BAR': '', stringFooBar: '' })
  })
  it('exception', () => {
    expect(decamelize(allCase, { force: true, exception: {
      PascalFooBar: kebabCase,
      'String? \"\'\t foo bar': 'string!',
    } })).toEqual({ camel_foo_bar: '', snake_foo_bar: '', kebab_foo_bar: '', 'pascal-foo-bar': '', constant_foo_bar: '', 'string!': '' })
  })
  it('exception (not force)', () => {
    expect(decamelize(allCase, { exception: {
      PascalFooBar: key => snakeCase(key).toUpperCase(),
      'String? \"\'\t foo bar': key => upperFirst(camelCase(key)),
    } })).toEqual({ camel_foo_bar: '', snake_foo_bar: '', 'kebab-foo-bar': '', 'PASCAL_FOO_BAR': '', 'CONSTANT_FOO_BAR': '', StringFooBar: '' })
  })
})
