import { BaseConfig } from './index'

class Config extends BaseConfig {
  public readonly prop = this.get('TEST').asString()
}

describe(BaseConfig.name, () => {
  it('should instantiate with defaults', () => {
    expect(new BaseConfig()).toBeInstanceOf(BaseConfig)
  })

  it('should be extendable', () => {
    const myConfig = new Config()
    expect(myConfig).toHaveProperty('prop')
  })

  it('should allow process.env override via constructor', () => {
    const myConfig = new Config({ TEST: 'foo' })
    expect(myConfig.prop).toBe('foo')
  })

  it('should be frozen on the next interval', (done) => {
    const myConfig = new Config()

    setTimeout(() => {
      // @ts-ignore
      expect(() => { myConfig.prop = 1 }).toThrowError(/Cannot assign to read only property/)
      done()
    }, 50)
  });
})