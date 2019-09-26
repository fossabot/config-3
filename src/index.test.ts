import { BaseConfig } from './index'
import { join } from 'path'

class Config extends BaseConfig {
  public readonly PORT = this.get('PORT').asIntPositive()
}

describe(BaseConfig.name, () => {
  beforeEach(() => {
    process.env.PORT = '3000'
  })

  afterEach(() => {
    delete process.env.PORT
  })

  it('should instantiate with defaults', () => {
    expect(new BaseConfig()).toBeInstanceOf(BaseConfig)
  })

  it('should be extendable', () => {
    const myConfig = new Config()
    expect(myConfig).toHaveProperty('PORT')
  })

  it('should allow process.env override via constructor', () => {
    const myConfig = new Config({ PORT: '1000' })
    expect(myConfig.PORT).toBe(1000)
  })

  it('should be frozen on the next interval', (done) => {
    const myConfig = new Config()

    setTimeout(() => {
      // @ts-ignore
      expect(() => { myConfig.PORT = 1 }).toThrowError(/Cannot assign to read only property/)
      done()
    }, 50)
  })

  it('should read defaults from .env file', () => {
    process.env.DOTENV_CONFIG_PATH = join(__dirname, '../tests/.env')

    const myConfig = new Config()
    expect(myConfig.PORT).toBe(2000)

    delete process.env.DOTENV_CONFIG_PATH
  });
})