import fetch from 'node-fetch';
import { version } from '../../package.json';

export async function checkForUpdate(): Promise<void> {
  try {
    const res = await fetch('https://registry.npmjs.org/deloyn/latest');
    if (!res.ok) return;

    const json: any = await res.json();
    const latest = json.version;

    if (version !== latest) {
      console.log(`\n⚠ Update available: ${version} → ${latest}`.yellow);
      console.log(`Run ${'npm i -g deloyn'.cyan} to update.\n`.yellow);
    }
  } catch {
    // Slient error: if no internet, don't block the execution
  }
}
