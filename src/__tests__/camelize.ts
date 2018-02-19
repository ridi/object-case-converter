import { camelize, decamelize, CaseEnum, CaseRegex, converters } from '../camelize'

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
}

const snakeCaseObjectShallow = {
  id: '1',
  nick_name: 'nick1',
  contacts: [{ contactType: 'phone', value: '000-000-000' }, { contactType: 'email', value: 'test@email.com' }],
  news_letter:{ allEmail: false, marketingEmail: false },
}

const snakeCaseObjectShallowDepth2 = {
  id: '1',
  nick_name: 'nick1',
  contacts: [{ contactType: 'phone', value: '000-000-000' }, { contactType: 'email', value: 'test@email.com' }],
  news_letter:{ all_email: false, marketing_email: false },
}

const camelCaseObject = {
  id: '1',
  nickName: 'nick1',
  contacts: [{ contactType: 'phone', value: '000-000-000' }, { contactType: 'email', value: 'test@email.com' }],
  newsLetter: { allEmail: false, marketingEmail: false },
}

const camelCaseObjectShallow = {
  id: '1',
  nickName: 'nick1',
  contacts: [{ contact_type: 'phone', value: '000-000-000' }, { contact_type: 'email', value: 'test@email.com' }],
  newsLetter: { all_email: false, marketing_email: false },
}

const camelCaseObjectShallowDepth2 = {
  id: '1',
  nickName: 'nick1',
  contacts: [{ contact_type: 'phone', value: '000-000-000' }, { contact_type: 'email', value: 'test@email.com' }],
  newsLetter: { allEmail: false, marketingEmail: false },
}

describe('Default usages', () => {
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

describe('Shallow camelize', () => {
  it('camelize array', () => {
    expect(camelize(snakeCaseArray, { recursive: 2 })).toEqual(camelCaseArrayShallow)
  })
  it('camelize object', () => {
    expect(camelize(snakeCaseObject)).toEqual(camelCaseObjectShallow)
  })
  it('camelize object with 2 depth', () => {
    expect(camelize(snakeCaseObject, { recursive: 2 })).toEqual(camelCaseObjectShallowDepth2)
  })
})

describe('Shallow decamelize', () => {
  it('decamelize array', () => {
    expect(decamelize(camelCaseArray, { recursive: 2 })).toEqual(snakeCaseArrayShallow)
  })
  it('decamelize object', () => {
    expect(decamelize(camelCaseObject)).toEqual(snakeCaseObjectShallow)
  })
  it('decamelize object with 2 depth', () => {
    expect(decamelize(camelCaseObject, { recursive: 2 })).toEqual(snakeCaseObjectShallowDepth2)
  })
})


const allCase = {
  camelCase: 'camelCase',
  snake_case: 'snake_case',
  'kebab-case': 'kebab-case',
  PascalCase: 'PascalCase',
  CONSTANT_CASE: 'CONSTANT_CASE',
  'String? \"\'\t case': '',
}

describe('All cases', () => {
  it('camelize', () => {
    expect(camelize(allCase)).toEqual({camelCase: 'camelCase', snakeCase: 'snake_case', kebabCase: 'kebab-case', pascalCase: 'PascalCase', constantCase: 'CONSTANT_CASE', stringCase: '' })
  })
  it('decamelize', () => {
    expect(decamelize(allCase)).toEqual({ camel_case: 'camelCase', snake_case: 'snake_case', 'kebab-case': 'kebab-case', PascalCase: 'PascalCase', CONSTANT_CASE: 'CONSTANT_CASE', 'String? \"\'\t case': '' })
  })
  it('force decamelize', () => {
    expect(decamelize(allCase, { force: true })).toEqual({ camel_case: 'camelCase', snake_case: 'snake_case', kebab_case: 'kebab-case', pascal_case: 'PascalCase', constant_case: 'CONSTANT_CASE', string_case: '' })
  })
})

describe('Excludes option', () => {
  it('string[]', () => {
    expect(camelize(allCase, { excludes: ['CONSTANT_CASE', 'snake_case'] })).toEqual({camelCase: 'camelCase', snake_case: 'snake_case', kebabCase: 'kebab-case', pascalCase: 'PascalCase', 'CONSTANT_CASE': 'CONSTANT_CASE', stringCase: '' })
  })
  it('RegExp', () => {
    expect(camelize(allCase, { excludes: CaseRegex.Constant })).toEqual({camelCase: 'camelCase', snakeCase: 'snake_case', kebabCase: 'kebab-case', pascalCase: 'PascalCase', 'CONSTANT_CASE': 'CONSTANT_CASE', stringCase: '' })
  })
  it('function', () => {
    expect(camelize(allCase, { excludes: key => {
      if (CaseRegex.Constant.test(key)) {
        return converters[CaseEnum.Kebab](key)
      }
      return true
    } })).toEqual({camelCase: 'camelCase', snakeCase: 'snake_case', kebabCase: 'kebab-case', pascalCase: 'PascalCase', 'constant-case': 'CONSTANT_CASE', stringCase: '' })
  })
})
