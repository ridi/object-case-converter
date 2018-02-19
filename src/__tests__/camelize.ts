import { camelize, decamelize, CaseEnum } from '../camelize'

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

describe('Default usages', () => {
  it('camelize array', () => {
    expect(camelize(snakeCaseArray)).toEqual(camelCaseArray)
  })
  it('camelize object', () => {
    expect(camelize(snakeCaseObject)).toEqual(camelCaseObject)
  })
  it('decamelize array', () => {
    expect(decamelize(camelCaseArray)).toEqual(snakeCaseArray)
  })
  it('decamelize object', () => {
    expect(decamelize(camelCaseObject)).toEqual(snakeCaseObject)
  })
})

describe('Shallow API', () => {
  it('camelize array', () => {
    expect(camelize(snakeCaseArray, { depth: 1 })).toEqual(camelCaseArrayShallow)
  })
  it('camelize object', () => {
    expect(camelize(snakeCaseObject, { depth: 1 })).toEqual(camelCaseObjectShallow)
  })
  it('decamelize array', () => {
    expect(decamelize(camelCaseArray, { depth: 1 })).toEqual(snakeCaseArrayShallow)
  })
  it('decamelize object', () => {
    expect(decamelize(camelCaseObject, { depth: 1 })).toEqual(snakeCaseObjectShallow)
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
})

describe('Specific style', () => {
  it('snake case', () => {
    expect(decamelize(allCase, { style: CaseEnum.Snake })).toEqual({ camel_case: 'camelCase', snake_case: 'snake_case', 'kebab-case': 'kebab-case', PascalCase: 'PascalCase', CONSTANT_CASE: 'CONSTANT_CASE', 'String? \"\'\t case': '' })
  })
  it('kebab case', () => {
    expect(decamelize(allCase, { style: CaseEnum.Kebab })).toEqual({ 'camel-case': 'camelCase', snake_case: 'snake_case', 'kebab-case': 'kebab-case', PascalCase: 'PascalCase', CONSTANT_CASE: 'CONSTANT_CASE', 'String? \"\'\t case': '' })
  })
  it('pascal case', () => {
    expect(decamelize(allCase, { style: CaseEnum.Pascal })).toEqual({ CamelCase: 'camelCase', snake_case: 'snake_case', 'kebab-case': 'kebab-case', PascalCase: 'PascalCase', CONSTANT_CASE: 'CONSTANT_CASE', 'String? \"\'\t case': '' })
  })
})

describe('Force option', () => {
  it('default case', () => {
    expect(decamelize(allCase, { style: CaseEnum.Snake, force: true })).toEqual({ camel_case: 'camelCase', snake_case: 'snake_case', kebab_case: 'kebab-case', pascal_case: 'PascalCase', constant_case: 'CONSTANT_CASE', string_case: '' })
  })
  it('kebab case', () => {
    expect(decamelize(allCase, { style: CaseEnum.Kebab, force: true })).toEqual({ 'camel-case': 'camelCase', 'snake-case': 'snake_case', 'kebab-case': 'kebab-case', 'pascal-case': 'PascalCase', 'constant-case': 'CONSTANT_CASE', 'string-case': '' })
  })
  it('pascal case', () => {
    expect(decamelize(allCase, { style: CaseEnum.Pascal, force: true })).toEqual({ CamelCase: 'camelCase', SnakeCase: 'snake_case', KebabCase: 'kebab-case', PascalCase: 'PascalCase', ConstantCase: 'CONSTANT_CASE', StringCase: '' })
  })
})

describe('Excludes', () => {
  it('camelize without string[]', () => {
    expect(camelize(allCase, { excludes: ['CONSTANT_CASE', 'snake_case'] })).toEqual({camelCase: 'camelCase', snake_case: 'snake_case', kebabCase: 'kebab-case', pascalCase: 'PascalCase', 'CONSTANT_CASE': 'CONSTANT_CASE', stringCase: '' })
  })
  it('camelize without RegExp[]', () => {
    expect(camelize(allCase, { excludes: [/^[A-Z_]+$/] })).toEqual({camelCase: 'camelCase', snakeCase: 'snake_case', kebabCase: 'kebab-case', pascalCase: 'PascalCase', 'CONSTANT_CASE': 'CONSTANT_CASE', stringCase: '' })
  })
  it('camelize without Array<string | RegExp>', () => {
    expect(camelize(allCase, { excludes: ['kebab-case', /^[A-Z_]+$/] })).toEqual({camelCase: 'camelCase', snakeCase: 'snake_case', 'kebab-case': 'kebab-case', pascalCase: 'PascalCase', 'CONSTANT_CASE': 'CONSTANT_CASE', stringCase: '' })
  })
  it('camelize exclude {key: value}', () => {
    expect(camelize(allCase, { excludes: [{'kebab-case': CaseEnum.Pascal}] })).toEqual({camelCase: 'camelCase', snakeCase: 'snake_case', KebabCase: 'kebab-case', pascalCase: 'PascalCase', constantCase: 'CONSTANT_CASE', stringCase: '' })
  })
  it('camelize exclude multiple types', () => {
    expect(camelize(allCase, { excludes: ['snake_case', /^[A-Z_]+$/, {'kebab-case': CaseEnum.Pascal, camelCase: CaseEnum.Kebab}, {PascalCase: CaseEnum.Snake}] })).toEqual({'camel-case': 'camelCase', snake_case: 'snake_case', KebabCase: 'kebab-case', pascal_case: 'PascalCase', 'CONSTANT_CASE': 'CONSTANT_CASE', stringCase: '' })
  })
  it('camelize exclude {RegExp: CaseEnum}', () => {
    expect(camelize(allCase, { excludes: [{'/^[A-Z_]+$/': CaseEnum.Kebab}] })).toEqual({camelCase: 'camelCase', snakeCase: 'snake_case', kebabCase: 'kebab-case', pascalCase: 'PascalCase', 'constant-case': 'CONSTANT_CASE', stringCase: '' })
  })
})
