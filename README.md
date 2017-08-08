# object-case-converter

[![Greenkeeper badge](https://badges.greenkeeper.io/ridibooks/object-case-converter.svg)](https://greenkeeper.io/)

Convert keys in an javascript Object or Array to the specific forms(camelCase, snake_case, etc.)

## Installation

```
$ npm install --save object-case-converter
```

## Usage

### ES6
```javascript
import { camelCase, snakeCase } from 'object-case-converter';

const result1 = camelCase(null);
// result1 = null

const result2 = camelCase({
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

const result3 = snakeCase([
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
var converter = require('object-case-converter');

converter.camelCase(...);
converter.snakeCase(...);

```

### Methods
#### camelCase(objectOrArray, isRecursive = false)

Convert keys in an object or objects in an array to `camelCase`

* objectOrArray [Object|Array] - object or array to be converted
* isRecursive [boolean] - If it is true, this function works as recursive way

#### snakeCase(objectOrArray, isRecursive = false)

Convert keys in an object or objects in an array to `snake_case`

* objectOrArray [Object|Array] - object or array to be converted
* isRecursive [boolean] - If it is true, this function works as recursive way

## Development

```
$ git clone git@github.com:ridibooks/object-case-converter.git
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
