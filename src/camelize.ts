import {
  camelCase,
  snakeCase,
} from 'lodash-es';

enum CaseEnum {
  Camel = 'camelCase',
  Snake = 'snakeCase',
}

const converters: { [style in CaseEnum]: (string?: string) => string } = {
  camelCase,
  snakeCase,
};

export type Recursive = true | string[]| { excludes: string[] };
export type Excludes = string[] | RegExp | ((key: string) => boolean);
export interface Exception { [key: string]: string | ((key?: string) => string); }

interface Options {
  style: CaseEnum;
  recursive?: Recursive;
  excludes?: Excludes;
  exception?: Exception;
  force?: boolean;
}

const isRegExp = (obj: any): obj is RegExp => obj instanceof RegExp;
const isCamelCase = (str: string) => str === camelCase(str);

function core<T>(target: any, options: Options): T {
  const {
    style,
    recursive = false,
    excludes,
    exception,
    force = false,
  } = options;

  const isExclude = ((): (key: string) => boolean => {
    if (Array.isArray(excludes)) {
      return (key) => excludes.includes(key);
    }
    if (typeof excludes === 'function') {
      return (key) => excludes(key);
    }
    if (isRegExp(excludes)) {
      return (key) => excludes.test(key);
    }
    return () => false;
  })();

  const convert = ((): (key: string) => string => {
    const convertFn = converters[style];

    if (excludes) {
      return (key) => isExclude(key) ? key : convertFn(key);
    }

    if (exception) {
      return (key) => {
        const value = exception[key];
        if (value) {
          return typeof value === 'function' ? value(key) : value;
        }
        return force || isCamelCase(key) ? convertFn(key) : key;
      };
    }

    return (key) => force || isCamelCase(key) ? convertFn(key) : key;
  })();

  const isRecursive = ((): (key?: string) => boolean => {
    if (Array.isArray(recursive)) {
      return (key) => recursive.includes(key);
    }
    if (typeof recursive === 'object' && Array.isArray(recursive.excludes)) {
      return (key) => !isExclude(key) && !recursive.excludes.includes(key);
    }
    if (recursive === true) {
      return (key) => !isExclude(key);
    }
    return () => false;
  })();

  const mapObject = <U extends any[] | object>(obj: any): U => {
    if (!obj || (typeof obj !== 'object')) { return obj; }

    if (Array.isArray(obj)) {
      return obj.map((o) => mapObject(o)) as U;
    }

    if (Object.prototype.toString.call(obj) === '[object Object]') {
      return Object.entries(obj).reduce((result, [key, value]) => Object.assign(result, {
        [convert(key)]: isRecursive(key) ? mapObject(value) : value,
      }), {} as U);
    }

    return obj;
  };

  return mapObject(target);
}

export interface CamelizeOpts {
  recursive?: Recursive;
  excludes?: Excludes;
}

export function camelize<T>(target: any, options: CamelizeOpts = {}): T {
  return core(target, Object.assign<Options, CamelizeOpts>({ style: CaseEnum.Camel, force: true }, options));
}

export interface DecamelizeOpts {
  recursive?: Recursive;
  exception?: Exception;
  force?: true;
}

export function decamelize<T>(target: any, options: DecamelizeOpts = {}): T {
  return core(target, Object.assign<Options, DecamelizeOpts>({ style: CaseEnum.Snake }, options));
}
