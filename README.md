# object-case-converter

[![npm](https://img.shields.io/npm/v/@ridi/object-case-converter.svg)](https://www.npmjs.com/package/@ridi/object-case-converter)
[![Build Status](https://travis-ci.org/ridi/object-case-converter.svg?branch=master)](https://travis-ci.org/ridi/object-case-converter)
[![Greenkeeper badge](https://badges.greenkeeper.io/ridi/object-case-converter.svg)](https://greenkeeper.io/)

Convert keys in an javascript Object to the specific style(camelCase, snake_case, etc.)

## Installation

```
$ npm install --save @ridi/object-case-converter
```

## Usage

### ES6
```javascript
import { camelize, decamelize } from '@ridi/object-case-converter';

const result1 = camelize(null);
// result1 = null

const result2 = camelize({
    id: '1',
    nick_name: 'nick1',
    contacts: [{ contact_type: 'phone', value: '000-000-000' }, { contact_type: 'email', value: 'test@email.com' }],
    news_letter: { all_email: false, marketing_email: false },
});
// result2 = {
//    id: '1',
//    nickName: 'nick1',
//    contacts: [{ contact_type: 'phone', value: '000-000-000' }, { contact_type: 'email', value: 'test@email.com' }],
//    newsLetter: { all_email: false, marketing_email: false },
//}

const result3 = decamelize([
    { id: '1', nickName: 'nick1', contacts: [{ contactType: 'phone', value: '000-000-000' }, { contactType: 'email', value: 'test@email.com' }] },
    { id: '2', nickName: 'nick2', contacts: [] },
    { id: '3', nickName: 'nick3', contacts: [{ contactType: 'address', value: 'xxx' }] },
], true);
// result3 = [
//    { id: '1', nick_name: 'nick1', contacts: [{ contact_type: 'phone', value: '000-000-000' }, { contact_type: 'email', value: 'test@email.com' }] },
//    { id: '2', nick_name: 'nick2', contacts: [] },
//    { id: '3', nick_name: 'nick3', contacts: [{ contact_type: 'address', value: 'xxx' }] },
//]
```

### ES5
```javascript
var converter = require('@ridi/object-case-converter');

converter.camelize(...);
converter.decamelize(...);

```

### Methods
#### camelize(collection, options = {})

Convert keys in an object or collection to `camelCase`

* collection (Array|Object) - object or array to be converted
* [options] (Object)

        {
            recursive?: true | string[]| { excludes: string[] }
            excludes?: string[] | RegExp | ((key: string) => boolean)
        }

    * recursive - convert as recursively
    * excludes - excludes from convertion


#### decamelize(collection, options = { force: false })

Convert keys **that are camelCase only** in an object or collection to `snake_case`

* collection (Array|Object) - object or array to be converted
* [options] (Object)

        {
            recursive?: true | string[]| { excludes: string[] }
            exception?: { [key: string]: string | ((key?: string) => string) }
            force?: true
        }

    * recursive - convert as recursively
    * exception - convert to specified value
    * force - convert all keys to snake_case

### Options

* `recursive`: false

  * true -- always convert recursively
  * string[] -- recursively only if key is includes in array
  * { excludes: string[] } -- convert when key is not in `recursive.excludes` array

  If set true or { excludes: string[] } with `excludes` option, recursive inherit excludes option.

* `excludes`: `undefined`

  * string[] -- excludes from convertion if key is in the array
  * RegExp -- excludes matched keys
  * (key: string) => boolean -- excludes when function are return true

* `exception`: `{}`

      {
        [key: string]: string | ((key?: string) => string)
      }

  * string -- key is converted to specific string
  * (key?: string) => string -- converted to return value

* `force`: false

  If true, convert without checking that the key is camelCase

## Development

```
$ git clone git@github.com:ridi/object-case-converter.git
$ cd object-case-converter
$ npm install
```

### Build

Transpile TypeScript

```
$ npm run build
```

### Test

Tests using Jest

```
$ npm test
```
