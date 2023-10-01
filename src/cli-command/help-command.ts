import {CliCommandInterface} from './cli-command.interface.js';
import chalk from 'chalk';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
        ${chalk.bgGreen('Программа для подготовки данных для REST API сервера.')}
        Пример:
            ts-node main.cli.ts ${chalk.cyanBright('--<command>')} ${chalk.blueBright('[--arguments]')}
         ${chalk.bold('Команды')}
              ${chalk.greenBright('--version:')}                  ${chalk.bgGreen('# выводит номер версии')}
              ${chalk.greenBright('--help:')}                     ${chalk.bgGreen('# печатает этот текст')}
              ${chalk.greenBright('--import')} ${chalk.blueBright('<path>')}:            ${chalk.bgGreen('# импортирует данные из TSV')}
              ${chalk.greenBright('--generate')} ${chalk.blueBright('<n> <path> <url>')} ${chalk.bgGreen('# генерирует произвольное количество тестовых данных')}
        `);
  }
}
