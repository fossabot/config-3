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

## Guidelines

* Property names should match the environment variable name, including case. E.g. `NODE_ENV`.
* Properties should be always marked as `readonly`.
* Use strict methods where possible, e.g. use `asBoolStrict` not `asBool`.

## License

MIT © Scale Leap
