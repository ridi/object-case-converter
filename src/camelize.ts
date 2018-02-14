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

export type options = {
  style?: CaseEnum
  depth?: number
  excludes?: Array<string | RegExp | { [key: string]: CaseEnum }>
}

const isDate = function (obj: any) {
  return obj instanceof Date
}

const isRegExp = function (obj: any) {
  return obj instanceof RegExp
}

export function camelize<T> (obj: any, options: options = {}): T {
  const style = options.style || CaseEnum.Camel;
  const depth = options.depth || 0
  const excludes = (options.excludes || []).reduce((result, item) => Object.assign(
    result,
    (typeof item === 'string' || item instanceof RegExp) ? { [<string>item]: '' } : item,
  ), <{ [key: string]: CaseEnum | '' }>{})

  const excludeKeys = Object.keys(excludes);
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
    if (depth && currentDepth > depth) {
      return obj
    } else if (!obj || (typeof obj !== 'object')) {
      return obj
    } else if (isDate(obj) || isRegExp(obj)) {
      return obj
    } else if (Array.isArray(obj)) {
      return <U>obj.map(o => mapObject(o, currentDepth))
    }
    return Object.entries(obj).reduce((result, [key, value]) => Object.assign(result, {
      [convert(key)]: mapObject(value, currentDepth + 1)
    }), <U>{})
  }

  return mapObject(obj)
}

export function decamelize<T> (obj: any, options: options = {}): T {
  return camelize(obj, Object.assign({
    style: CaseEnum.Snake
  }, options))
}
