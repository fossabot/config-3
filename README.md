# @scaleleap/config

> Extendable configuration base class for [12 Factor](https://12factor.net/config) application.

## Install

```sh
npm i @scaleleap/config
```

## Usage

```ts
// in ./src/config.ts

import { BaseConfig } from '@scaleleap/config'

class Config extends BaseConfig {
  public readonly TEST = this.get('TEST').asString()
}
```

```ts
// in ./src/app.ts

const config = new Config()

console.log(config.TEST)
```

## Documentation

Parent `Config` class exposes a single protected method `get`, which maps to
[env-var#get](https://www.npmjs.com/package/env-var#getvarname-default) method.

The constructor accepts a single argument, which is an dictionary of key-value strings, that
represents the environment. The value defaults to
[`process.env`](https://nodejs.org/api/process.html#process_process_env).

This is useful, when you'd like to override the values for testing:

```ts
const config = new Config({ NODE_ENV: '...' })
```

This module will automatically read `.env` file contents from `$PWD/.env`.

You can influence the discovery path of `.env` file via `DOTENV_CONFIG_PATH` environment variable.

E.g.

```sh
DOTENV_CONFIG_PATH=.env.prod node foo.js
```

### Using a Prefix

Sometimes it is desirable to scope all of the environment variables. This can be achieved through
a prefix.

Example:

```ts
class Config extends BaseConfig {
  protected readonly prefix = 'FOO_'

  public readonly TEST = this.get('TEST').asString()
}
```

Will then look for environment variable named `FOO_TEST` instead of just `TEST`.

**Note**: The underscore `_` character is **not** included by default and must be part of your prefix.

Be careful when working with built-in variables, as they would not be discovered, because of the prefix.

### Variable Expansion

It is possible to expand variables:

```sh
FOO=bar
BAZ=${FOO}-baz
```

When the `BAZ` value is expanded, the result will be:

```sh
FOO=bar
BAZ=bar-baz
```

### Built-in Variables

There are some universal variables that are included into the config.

For now, there is just one.

#### `NODE_ENV`

Valid values are:

* `development`
* `test`
* `production`

Example:

```sh
NODE_ENV=production node foo.js
```

Also comes with convenience boolean assertion getters:

* `isDevelopment`
* `isTest`
* `isProduction`

Example:

```ts
const config = new Config()

if (config.isDevelopment) {
  // do something destructive
}
```

## Guidelines

* Property names should match the environment variable name, including case. E.g. `NODE_ENV`.
* Properties should be always marked as `readonly`.
* Use strict methods where possible, e.g. use `asBoolStrict` not `asBool`.

## License

MIT © Scale Leap
