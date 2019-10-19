import { join } from 'path'

import { BaseConfig, environmentDefaults } from '.'

class Config extends BaseConfig {
  public readonly PORT = this.get('PORT').asIntPositive()
}

describe(environmentDefaults.name, () => {
  beforeEach(() => {
    process.env.DOTENV_CONFIG_PATH = join(__dirname, '../tests/.env')
    process.env.FOO = 'bar'
  })

  afterEach(() => {
    delete process.env.FOO
    delete process.env.DOTENV_CONFIG_PATH
  })

  it('should retain original process.env values', () => {
    expect.hasAssertions()

    const vars = environmentDefaults()

    expect(vars.FOO).toBe('bar')
  })
})

describe(BaseConfig.name, () => {
  beforeEach(() => {
    process.env.PORT = '3000'
  })

  afterEach(() => {
    delete process.env.PORT
  })

  it('should instantiate with defaults', () => {
    expect.hasAssertions()
    expect(new BaseConfig()).toBeInstanceOf(BaseConfig)
  })

  it('should be extendable', () => {
    expect.hasAssertions()

    const myConfig = new Config()

    expect(myConfig).toHaveProperty('PORT')
    expect(myConfig.PORT).toBe(3000)
  })

  it('should allow process.env override via constructor', () => {
    expect.hasAssertions()

    const myConfig = new Config({ PORT: '1000' })

    expect(myConfig.PORT).toBe(1000)
  })

  it('should be frozen on the next interval', async () => {
    expect.assertions(1)

    const promise = new Promise(done => {
      const myConfig = new Config()

      const mutate = (): Config => Object.assign(myConfig, { PORT: 1 })

      setTimeout(() => {
        expect(mutate).toThrow(/Cannot assign to read only property/)

        done()
      }, 50)
    })

    await promise
  })
})

describe(BaseConfig.name, () => {
  it('should read defaults from .env file', () => {
    expect.hasAssertions()

    process.env.DOTENV_CONFIG_PATH = join(__dirname, '../tests/.env')

    const myConfig = new Config()

    expect(myConfig.PORT).toBe(2000)

    delete process.env.DOTENV_CONFIG_PATH
  })
})
