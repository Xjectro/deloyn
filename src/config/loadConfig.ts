import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { register } from 'esbuild-register/dist/node';

const CONFIG_FILES = ['deloyn.config.ts', 'deloyn.config.js'];

export async function loadConfig(): Promise<any> {
  const cwd = process.cwd();
  const configFile = CONFIG_FILES.find((file) =>
    fs.existsSync(path.join(cwd, file)),
  );

  if (!configFile) {
    console.error('❌ No deloyn config file found.');
    process.exit(1);
  }

  const fullPath = path.resolve(cwd, configFile);

  if (configFile.endsWith('.ts')) {
    register({ target: 'node18' });
  }

  const require = createRequire(import.meta.url);
  const config = require(fullPath);

  return config.default || config;
}
