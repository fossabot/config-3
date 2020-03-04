import { isNode } from 'browser-or-node'
import { config } from 'dotenv'
import { from } from 'env-var'

const NODE_ENV_DEVELOPMENT = 'development'
const NODE_ENV_TEST = 'test'
const NODE_ENV_PRODUCTION = 'production'
const NODE_ENVS = [NODE_ENV_DEVELOPMENT, NODE_ENV_TEST, NODE_ENV_PRODUCTION] as const

type NodeEnvs = typeof NODE_ENVS[-1]
type From = ReturnType<typeof from>

export function environmentDefaults(): NodeJS.ProcessEnv {
  // browser environments
  if (!isNode) {
    return {}
  }

  const { error } = config({ path: process.env.DOTENV_CONFIG_PATH })

  // ignore "ENOENT: no such file or directory" error, if `.env` file does not exist
  if (error && !error.message.startsWith('ENOENT')) {
    throw error
  }

  return process.env
}

export class BaseConfig {
  public constructor(private readonly environment = environmentDefaults()) {
    // We can freeze the object only on the next tick, because classes extending
    // this base class need to be able to modify the object during construction.
    // This isn't the best solution, as it will fail to catch prop mutations during the initial
    // loading, but at least it will catch them later during runtime.
    setImmediate(() => Object.freeze(this))
  }

  private readonly from = from(this.environment)

  public get(varName: string, defaultValue?: string) {
    if (defaultValue) {
      return this.from.get(varName, defaultValue)
    }

    return this.from.get(varName)
  }

  /**
   * Determines running environment via `NODE_ENV` variable.
   */
  public readonly NODE_ENV = this.get('NODE_ENV', NODE_ENV_DEVELOPMENT).asEnum([
    ...NODE_ENVS,
  ]) as NodeEnvs

  public get isDevelopment(): boolean {
    return this.NODE_ENV === NODE_ENV_DEVELOPMENT
  }

  public get isTest(): boolean {
    return this.NODE_ENV === NODE_ENV_TEST
  }

  public get isProduction(): boolean {
    return this.NODE_ENV === NODE_ENV_PRODUCTION
  }
}
