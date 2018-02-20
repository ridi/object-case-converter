import {
  camelCase,
  snakeCase,
} from 'lodash-es'

enum CaseEnum {
  Camel = 'camelCase',
  Snake = 'snakeCase',
}

const converters = { camelCase, snakeCase }

export type recursive = true | string[]| { excludes: string[] }
export type excludes = string[] | RegExp | ((key: string) => boolean)
export type exception = { [key: string]: string | ((key?: string) => string) }

type options = {
  style: CaseEnum
  recursive?: recursive
  excludes?: excludes
  exception?: exception
  force?: boolean
}

const isRegExp = (obj: any): obj is RegExp => obj instanceof RegExp
const isCamelCase = (str: string) => str === camelCase(str)

function core<T> (obj: any, options: options): T {
  const {
    style,
    recursive = false,
    excludes,
    exception,
    force = false,
  } = options

  const isExclude = ((): (key: string) => boolean => {
    if (Array.isArray(excludes)) {
      return key => excludes.includes(key)
    }
    if (typeof excludes === 'function') {
      return key => excludes(key)
    }
    if (isRegExp(excludes)) {
      return key => excludes.test(key)
    }
    return () => false
  })()

  const convert = ((): (key: string) => string => {
    const convertFn = converters[style || CaseEnum.Camel]

    if (excludes) {
      return key => isExclude(key) ? key: convertFn(key)
    }

    if (exception) {
      return key => {
        const value = exception[key]
        if (value) {
          return typeof value === 'function' ? value(key) : value
        }
        return force || isCamelCase(key) ? convertFn(key) : key
      }
    }

    return key => force || isCamelCase(key) ? convertFn(key) : key
  })()

  const isRecursive = ((): (key?: string) => boolean => {
    if (Array.isArray(recursive)) {
      return key => recursive.includes(key)
    }
    if (typeof recursive === 'object' && Array.isArray(recursive.excludes)) {
      return key => !isExclude(key) && !recursive.excludes.includes(key)
    }
    if (recursive === true) {
      return key => !isExclude(key)
    }
    return () => false
  })()

  const mapObject = <U extends Array<any> | Object>(obj: any): U => {
    if (!obj || (typeof obj !== 'object')) return obj

    if (Array.isArray(obj)) {
      return <U>obj.map(o => mapObject(o))
    }

    if (Object.prototype.toString.call(obj) === '[object Object]') {
      return Object.entries(obj).reduce((result, [key, value]) => Object.assign(result, {
        [convert(key)]: isRecursive(key) ? mapObject(value) : value
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
  exception?: exception
  force?: boolean
}

export function decamelize<T> (obj: any, options: decamelizeOpts = {}): T {
  return core(obj, Object.assign<options, decamelizeOpts>({ style: CaseEnum.Snake }, options))
}
