import { from } from 'env-var'
import { isNode } from 'browser-or-node'
import { config } from 'dotenv'

type From = ReturnType<typeof from>

function envDefaults(): NodeJS.ProcessEnv {
  // browser environments
  if (!isNode) {
    return {}
  }

  const { parsed, error } = config({ path: process.env.DOTENV_CONFIG_PATH })

  if (error) {
    // ignore "ENOENT: no such file or directory" error, if `.env` file does not exist
    if (!error.message.includes('ENOENT')) {
      throw error
    }
  }

  if (parsed) {
    return parsed
  }

  return {}
}

export class BaseConfig {
  public constructor(private readonly env: NodeJS.ProcessEnv = envDefaults()) {
    // We can freeze the object only on the next tick, because classes extending
    // this base class need to be able to modify the object during construction.
    // This isn't the best solution, as it will fail to catch prop mutations during the initial
    // loading, but at least it will catch them later during runtime.
    setImmediate(() => Object.freeze(this))
  }

  protected readonly get: From['get'] = from(this.env).get
}
