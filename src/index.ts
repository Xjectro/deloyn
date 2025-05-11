#!/usr/bin/env node
import 'colors';
import { Command } from 'commander';
import oraPkg from 'ora';
import { prompt } from 'enquirer';

import { loadConfig } from './config/loadConfig';
import { push } from './commands/push';
import { checkForUpdate } from './utils/fetchers';
import { capitelize, performUpdate, printBanner } from './utils/helpers';
import { version as CURRENT_VERSION, name } from '../package.json';

export { defineConfig } from './config/defineConfig';
export type { DeloynConfig } from './types';

const ora = (oraPkg as any).default ?? oraPkg;
const program = new Command();

program
  .name('deloyn')
  .description(`${capitelize(name)} - SSH Publish & Deploy CLI`.cyan)
  .version(CURRENT_VERSION, '-v, --version', 'Show CLI version')
  .hook('preAction', async () => {
    if (program.args[0] !== 'update') {
      await checkForUpdate();
    }
  });

program
  .command('push')
  .description('Start publishing'.yellow)
  .action(async () => {
    const config = await loadConfig();

    const { confirm } = await prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to start publishing?'.yellow,
      },
    ]);

    if (!confirm) {
      console.log('Operation cancelled.'.red);
      process.exit(0);
    }

    const spinner = ora('Connecting and preparing files...'.cyan).start();

    try {
      await push(config);
      spinner.succeed('Publishing completed!'.green);
    } catch (e) {
      spinner.fail('An error occurred!'.red);
      if (e instanceof Error) console.error(`${e.message}`.red);
      process.exit(1);
    }
  });

program
  .command('update')
  .description(`Update ${name} CLI to latest version`.green)
  .action(async () => {
    await performUpdate();
  });

program
  .command('help', { isDefault: true })
  .description('Show help message'.blue)
  .action(() => {
    console.log(''.cyan);
    console.log(
      'Usage:'.underline.blue +
        ` ${capitelize(name)} [options] [command]\n`.yellow,
    );
    console.log(`${capitelize(name)} - SSH Publish & Deploy CLI`.cyan);
    console.log(''.cyan);

    console.log('Options:'.green);
    console.log('  -v, --version  Show CLI version'.yellow);
    console.log('  -h, --help     display help for command'.yellow);

    console.log(''.cyan);

    console.log('Commands:'.green);
    console.log('  push           Start publishing'.yellow);
    console.log(`  update         Update ${name} CLI to latest version`.green);
    console.log('  help           Show help message'.blue);
  });

async function bootstrap() {
  printBanner();
  const firstArg = process.argv[2];
  if (firstArg !== 'update') {
    await checkForUpdate();
  }

  program.parse(process.argv);
}

bootstrap();
