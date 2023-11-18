import { injectable } from 'inversify';
import {ConfigInterface} from '../../../common/config/config.interface';
import {ConfigSchema} from '../../../common/config/config.schema';
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
