import {CliCommandInterface} from './cli-command.interface';
import chalk from 'chalk';
import pkg from '../../package.json' assert { type: 'json' };

export default class VersionCommand implements CliCommandInterface {
  public readonly name = '--version';

  private readVersion(): string {
    return pkg.version;
  }

  public async execute(): Promise<void> {
    const version = this.readVersion();
    console.log(`${chalk.cyanBright(version)}`);
  }
}
