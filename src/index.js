import _camelCase from 'lodash.camelcase';
import _snakeCase from 'lodash.snakecase';

/**
 * Convert keys in an object or objects in an array using given function
 *
 * @param {Object|Array} object - object or array to be converted
 * @param {Function} convertFunc
 * @param {boolean} [isShallow=true] - If it is true, this function will not work as recursive way
 * @returns {*}
 * @private
 */
const _convert = (object, convertFunc, isShallow = true) => {
  if (Array.isArray(object)) {
    return object.map(value => _convert(value, convertFunc, isShallow));
  } else if (object && object.constructor.name === 'Object') {
    // Only if it is plain object
    const result = {};
    Object.keys(object).forEach((key) => {
      result[convertFunc(key)] = isShallow ? object[key] : _convert(object[key], convertFunc);
    });
    return result;
  }
  return object;
};

export const camelCase = (object, isShallow = true) => _convert(object, _camelCase, isShallow);
export const snakeCase = (object, isShallow = true) => _convert(object, _snakeCase, isShallow);
export default { camelCase, snakeCase };
