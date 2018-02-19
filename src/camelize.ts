import {
  camelCase,
  snakeCase,
  kebabCase,
  upperCase,
  upperFirst,
} from 'lodash-es'

export enum CaseEnum {
  Camel = 'camelCase',
  Snake = 'snakeCase',
  Kebab = 'kebabCase',
  Pascal = 'pascalCase',
  Constant = 'constantCase',
}

export const CaseRegex = {
  Camel: /^[a-z][a-zA-Z]+$/,
  Snake: /^[a-z_]+$/,
  Kebab: /^[a-z-]+$/,
  Pascal: /^[A-Z][a-zA-Z]+$/,
  Constant: /^[A-Z_]+$/,
}

export const converters = {
  [CaseEnum.Camel]: camelCase,
  [CaseEnum.Snake]: snakeCase,
  [CaseEnum.Kebab]: kebabCase,
  [CaseEnum.Pascal]: (string?: string): string => upperFirst(camelCase(string)),
  [CaseEnum.Constant]: (string?: string): string => upperCase(snakeCase(string)),
}

export type excludes = string[] | RegExp | ((key: string) => string | boolean)
export type recursive = boolean | number

type options = {
  style: CaseEnum
  recursive?: recursive
  excludes?: excludes
  force?: boolean
}

const isRegExp = (obj: any): obj is RegExp => obj instanceof RegExp
const isCamelCase = (str: string) => str === camelCase(str)

function core<T> (obj: any, options: options): T {
  const {
    style,
    recursive = false,
    excludes = [],
    force = false,
  } = options

  const depth: number = typeof recursive === 'boolean' ? Number(!recursive) : recursive > 0 ? recursive : 0

  const convert = ((): (key: string) => string => {
    const convertFn = converters[style || CaseEnum.Camel]
    if (Array.isArray(excludes)) {
      return key => {
        if (!force && !isCamelCase(key)) return key
        return excludes.includes(key) ? key : convertFn(key)
      }
    } else if (typeof excludes === 'function') {
      return key => {
        if (!force && !isCamelCase(key)) return key
        const result = excludes(key)
        if (typeof result === 'string') {
          return result
        } else if (result === false) {
          return key
        }
        return convertFn(key)
      }
    } else if (isRegExp(excludes)) {
      return key => {
        if (!force && !isCamelCase(key)) return key
        return excludes.test(key) ? key : convertFn(key)
      }
    }
    return key => key
  })()

  const mapObject = <U extends Array<any> | Object>(obj: any, currentDepth: number = 1): U => {
    if (depth && currentDepth > depth) return obj
    if (!obj || (typeof obj !== 'object')) return obj

    if (Array.isArray(obj)) {
      return <U>obj.map(o => mapObject(o, currentDepth + 1))
    }

    if (Object.prototype.toString.call(obj) === '[object Object]') {
      return Object.entries(obj).reduce((result, [key, value]) => Object.assign(result, {
        [convert(key)]: mapObject(value, currentDepth + 1)
      }), <U>{})
    }

    return obj
  }

  return mapObject(obj)
}

export type camelizeOpts = {
  recursive?: recursive
  excludes?: excludes
}

export function camelize<T> (obj: any, options: camelizeOpts = {}): T {
  return core(obj, Object.assign<camelizeOpts, options>(options, { style: CaseEnum.Camel, force: true }))
}

export type decamelizeOpts = {
  recursive?: recursive
  excludes?: excludes
  force?: boolean
}

export function decamelize<T> (obj: any, options: decamelizeOpts = {}): T {
  return core(obj, Object.assign<options, decamelizeOpts>({ style: CaseEnum.Snake }, options))
}
