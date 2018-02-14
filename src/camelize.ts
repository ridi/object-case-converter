import {
  camelCase,
  snakeCase,
  kebabCase,
  upperFirst,
} from 'lodash-es'

export enum CaseEnum {
  Camel = 'camelCase',
  Snake = 'snakeCase',
  Kebab = 'kebabCase',
  Pascal = 'pascalCase',
}

type functions = {
  [style in CaseEnum]: (string?: string) => string
}

const functions: functions = {
  [CaseEnum.Camel]: camelCase,
  [CaseEnum.Snake]: snakeCase,
  [CaseEnum.Kebab]: kebabCase,
  [CaseEnum.Pascal]: (string) => upperFirst(camelCase(string)),
}

export type excludes = Array<string | RegExp | { [key: string]: CaseEnum }>

type options = {
  style: CaseEnum
  depth?: number
  excludes?: excludes
  force?: boolean
}

const isRegExp = (obj: any) => obj instanceof RegExp
const isCamelCase = (str: string) => str === camelCase(str)

function core<T> (obj: any, options: options): T {
  const {
    style,
    depth = 0,
    force = false,
  } = options

  const excludes = (options.excludes || []).reduce((result, item) => Object.assign(
    result,
    (typeof item === 'string' || item instanceof RegExp) ? { [<string>item]: '' } : item,
  ), <{ [key: string]: CaseEnum | '' }>{})

  const excludeKeys = Object.keys(excludes)
  const excludeRegexes: RegExp[] = excludeKeys
    .map(str => {
      const [
        ,
        pattern = undefined,
        flags = undefined,
      ] = /\/(.+)\/([gimuy]*)/.exec(str) || []
      return pattern ? new RegExp(pattern, flags) : str
    })
    .filter((key): key is RegExp => isRegExp(key))

  const convertFn = functions[style]

  const convert = (key: string): string => {
    if (!force && !isCamelCase(key)) return key

    if (excludeKeys.includes(key)) {
      const func = functions[camelCase(excludes[key]) as CaseEnum]
      return func ? func(key) : key
    }

    const matchedRegex = excludeRegexes.find(regex => regex.test(key))
    if (matchedRegex) {
      const func = functions[camelCase(excludes[matchedRegex.toString()]) as CaseEnum]
      return func ? func(key) : key
    }

    return convertFn(key)
  }

  const mapObject = <U extends Array<any> | Object>(obj: any, currentDepth: number = 1): U => {
    if (depth && currentDepth > depth) return obj
    if (!obj || (typeof obj !== 'object')) return obj

    if (Array.isArray(obj)) {
      return <U>obj.map(o => mapObject(o, currentDepth))
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
  depth?: number
  excludes?: excludes
}

export function camelize<T> (obj: any, options: camelizeOpts = {}): T {
  return core(obj, Object.assign<camelizeOpts, options>(options, { style: CaseEnum.Camel, force: true }))
}

export type decamelizeOpts = {
  style?: CaseEnum.Snake | CaseEnum.Kebab | CaseEnum.Pascal
  depth?: number
  excludes?: excludes
  force?: boolean
}

export function decamelize<T> (obj: any, options: decamelizeOpts = {}): T {
  return core(obj, Object.assign<options, decamelizeOpts>({ style: CaseEnum.Snake }, options))
}
