import { execSync } from 'child_process';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { name, author } from '../../package.json';

export function capitelize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function performUpdate() {
  console.log(`\n🔄 Updating ${name} to latest version...\n`.cyan);
  try {
    execSync(`npm install -g ${name}`, { stdio: 'inherit' });
    console.log(`\n✅ ${capitelize(name)} successfully updated!\n`.green);
  } catch (e) {
    console.error(`\n❌ Failed to update ${name}.`.red);
    if (e instanceof Error) console.error(`${e.message}`.red);
    process.exit(1);
  }
}

export function printBanner() {
  const msg = figlet.textSync(name.toUpperCase(), {
    font: 'Slant',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  });

  console.log(gradient.pastel.multiline(msg));
  console.log(gradient.vice(`\n        🚀 SSH Deploy CLI by ${author}\n`));
  console.log(
    gradient.pastel('For more information, visit our documentation.'),
  );
  console.log(gradient.pastel('\n       Follow us on GitHub for updates!\n'));
}
