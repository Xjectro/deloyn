# Deloyn

SSH Publish & Deploy CLI

deloyn is a simple command-line tool to publish and deploy your project via SSH and SFTP under Node.

## Features

- **Interactive confirmation before deployment**  
  Before starting the publishing process, the user is prompted for confirmation, ensuring no accidental deployments.

- **Configurable via `deloyn.config.js` or `deloyn.config.ts`**  
  Easily configure deployment settings using JavaScript or TypeScript configuration files. Flexibility to define server details, source, and target directories.

- **Exclude files and directories**  
  Option to exclude specific files or directories from being published, giving you full control over what gets deployed.

- **Adjustable batch size for uploads**  
  Fine-tune the upload process with configurable batch sizes, allowing for optimized performance based on file sizes or network conditions.

- **Spinner feedback for progress**  
  Visual feedback during the publishing process, with a spinner to show that the deployment is in progress. Helps users understand the current state of the operation.

- **TypeScript support with ESM**  
  Full TypeScript support with ES modules (ESM), ensuring a smooth development experience with type safety and modern JavaScript features.

- **SSH-based deployment**  
  Securely deploy files over SSH to remote servers. The tool supports password authentication or SSH key-based authentication for a secure connection.

- **Real-time error reporting**  
  If any issues occur during the deployment, users receive immediate feedback with detailed error messages to aid troubleshooting.

- **Automated update checks**  
  The CLI automatically checks for new updates to ensure you're always using the latest features and security patches, with the option to update directly from the terminal.

- **Environment-specific configurations**  
  Define different configuration files for various environments (e.g., `config.production.js`, `config.staging.js`) to streamline deployments across multiple environments.

- **Customizable deployment steps**  
  Add custom commands or deployment steps before or after publishing (e.g., running tests, pre-deployment scripts), providing flexibility in the deployment workflow.

- **Log file generation**  
  Logs are generated during deployment, helping you keep track of what was deployed, any issues that arose, and a record of the process for auditing purposes.

- **Support for multiple servers**  
  Deploy to multiple remote servers at once with configurable server details in the config file. This is useful for scaling applications or deploying to different staging environments.

- **Automatic retries on failure**  
  In case of network interruptions or temporary failures, the CLI automatically retries failed uploads, ensuring reliable deployment even under less-than-ideal conditions.

- **Versioning and changelogs**  
  Track the version of each deployment and generate changelogs automatically based on your commit history or version tags, ensuring transparency and traceability for all deployed changes.

- **Customizable output formatting**  
  Customize the verbosity and format of the CLI output (e.g., silent, verbose, or minimal output) depending on your preference or environment.

- **Support for symbolic links**  
  Deploy symbolic links along with your files, ensuring that file references are preserved as intended in the deployment environment.

- **Security enhancements**  
  Features like automatic key rotation for SSH and encrypted deployment credentials in the configuration file to ensure the security of your deployment pipeline.

## Installation

Install globally:

```bash
npm install -g deloyn
```

Or use npx:

```bash
npx deloyn push
```

## Usage

```bash
deloyn push
```

Available Commands:

- `push`   Start publishing (requires config file)
  Start the publishing process by connecting to the remote server and uploading files.  
  Usage:
  ```bash
  deloyn push
  ```
- `update`  Update deloyn CLI to latest version Update the deloyn CLI tool to the latest version available.
  Usage:
  ```bash
  deloyn update
  ```
- `help`  Show help message Display the help message with all available commands and options.
  Usage:
  ```bash
  deloyn help
  ```
- `-v` / `--version`  Show CLI version Show the current version of the deloyn CLI.
  Usage:
  ```bash
  deloyn --version
  ```

## Configuration

Create a `deloyn.config.js` or `deloyn.config.ts` in your project root:

```ts
// deloyn.config.ts
import { defineConfig } from 'deloyn';

export default defineConfig({
  serverIp: '1.2.3.4',        // Remote server IP
  username: 'ubuntu',         // SSH username
  remotePath: '/var/www/app', // Path on remote server
  sshKey: '~/.ssh/id_rsa',    // SSH private key path
  excluded: [                 // Files or directories to exclude
    '.git',
    'node_modules',
    'dist',
    'README.md',
  ],
  batchSize: 5,               // Concurrent uploads per batch
  localPath: process.cwd(),   // Local root path to upload
  scripts: [                  // The commands are executed sequentially after deploy. It is up to you which package manager you use (pnpm, yarn, npm...).
    "npm install",
    "npm run build"
  ]
});
```

## License

MIT © xjectro
