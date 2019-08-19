import { from } from 'env-var'
import { isNode } from 'browser-or-node'

type From = ReturnType<typeof from>

export class BaseConfig {
  public constructor(private readonly env: NodeJS.ProcessEnv = isNode ? process.env : {}) {
    // We can freeze the object only on the next tick, because classes extending
    // this base class need to be able to modify the object during construction.
    // This isn't the best solution, as it will fail to catch prop mutations during the initial
    // loading, but at least it will catch them later during runtime.
    setImmediate(() => Object.freeze(this))
  }

  protected readonly get: From['get'] = from(this.env).get
}
