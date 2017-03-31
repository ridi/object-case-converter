import _camelCase from 'lodash.camelcase';
import _snakeCase from 'lodash.snakecase';

/**
 * Convert keys in an object or objects in an array using given function
 *
 * @param {Object|Array} object - object or array to be converted
 * @param {Function} convertFunc
 * @param {boolean} [recursive=false] - If it is true, this function works as recursive way
 * @returns {*}
 * @private
 */
const _convert = (object, convertFunc, recursive = false) => {
  if (Array.isArray(object)) {
    return object.map(value => _convert(value, convertFunc, recursive));
  } else if (object !== null && Object.prototype.toString.call(object) === '[object Object]') {
    const result = {};
    Object.keys(object).forEach((key) => {
      result[convertFunc(key)] = recursive ? _convert(object[key], convertFunc, recursive) : object[key];
    });
    return result;
  }
  return object;
};

export const camelCase = (object, recursive = false) => _convert(object, _camelCase, recursive);
export const snakeCase = (object, recursive = false) => _convert(object, _snakeCase, recursive);
export default { camelCase, snakeCase };
