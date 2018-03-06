# object-case-converter

[![npm](https://img.shields.io/npm/v/@ridi/object-case-converter.svg)](https://www.npmjs.com/package/@ridi/object-case-converter)
[![Build Status](https://travis-ci.org/ridi/object-case-converter.svg?branch=master)](https://travis-ci.org/ridi/object-case-converter)
[![Greenkeeper badge](https://badges.greenkeeper.io/ridi/object-case-converter.svg)](https://greenkeeper.io/)

Convert keys in an javascript Object or Array to the specific forms(camelize, snake_case, etc.)

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

Convert keys in an object or objects in an array to `camelize`

* collection (Array|Object) - object or array to be converted
* [options] (Object)

        options = {
            recursive?: true | string[]| { excludes: string[] }
            excludes?: string[] | RegExp | ((key: string) => boolean)
        }
    
    * recursive - convert only matched key as recursive
    * excludes - escape when key includes in string[] or when function or RegExp.test() are return true


#### decamelize(collection, options = { force: false })

Convert keys in an object or objects in an array **that are camelCase** to `snake_case`

* collection (Array|Object) - object or array to be converted
* [options] (Object)

        {
            recursive?: true | string[]| { excludes: string[] }
            exception?: { [key: string]: string | ((key?: string) => string) }
            force?: true
        }
    
    * recursive - convert only matched key as recursive
    * exception - when key has been owned by exception object, convert to value specified string or function return
    * force - always convert to snake_case without check if key is camelCase

## Development

```
$ git clone git@github.com:ridi/object-case-converter.git
$ cd object-case-converter
$ npm install
```

### Build

Webpack build using Babel (Not required in development.)

```
$ npm run build
```

### Test

Tests using Jest

```
$ npm test
```
