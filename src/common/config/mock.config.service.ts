import { injectable } from 'inversify';
import {ConfigInterface} from './config.interface';
import {ConfigSchema} from './config.schema';
@injectable()
export default class MockConfigService implements ConfigInterface<ConfigSchema> {
  private readonly config: ConfigSchema;
  constructor(config: Partial<ConfigSchema>) {
    this.config = config as unknown as ConfigSchema;
  }

  public get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T] {
    return this.config[key];
  }
}
