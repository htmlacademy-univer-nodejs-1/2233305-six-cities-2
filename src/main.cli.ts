#!/usr/bin/env node
import CLIApplication from './app/cli.js';
import HelpCommand from './common/cli-command/help-command.js';
import VersionCommand from './common/cli-command/version-command.js';
import ImportCommand from './common/cli-command/import-command.js';
import GenerateCommand from './common/cli-command/generate-command.js';

const cliApplication = new CLIApplication();
cliApplication.registerCommands([new HelpCommand, new VersionCommand, new ImportCommand, new GenerateCommand]);
cliApplication.processCommand(process.argv);
