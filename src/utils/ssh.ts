import fs from 'fs-extra';
import path from 'path';
import colors from 'colors';
import SftpClient from 'ssh2-sftp-client';
import { Client } from 'ssh2';

export async function processInBatches<T>(
  tasks: (() => Promise<T>)[],
  batchSize: number,
) {
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    await Promise.all(batch.map((task) => task()));
  }
}

export async function uploadDirectory(
  localDir: string,
  remoteDir: string,
  sftp: SftpClient,
  excluded: Set<string>,
  batchSize: number,
  statsCallback?: (size: number) => void,
) {
  const items = await fs.readdir(localDir);
  const tasks: (() => Promise<void>)[] = [];

  for (const item of items) {
    if (excluded.has(item)) {
      console.info(colors.yellow(`Skipping: ${path.join(localDir, item)}`));
      continue;
    }

    tasks.push(async () => {
      const localPath = path.join(localDir, item);
      const remotePath = path.join(remoteDir, item).replace(/\\/g, '/');
      const stats = await fs.stat(localPath);

      if (stats.isDirectory()) {
        await sftp.mkdir(remotePath, true);
        console.info(colors.green(`📁 Directory: ${remotePath}`));
        await uploadDirectory(
          localPath,
          remotePath,
          sftp,
          excluded,
          batchSize,
          statsCallback,
        );
      } else {
        await sftp.put(localPath, remotePath);
        statsCallback?.(stats.size);
        console.info(colors.cyan(`📄 Uploaded: ${remotePath}`));
      }
    });
  }

  await processInBatches(tasks, batchSize);
}

export async function executeRemoteCommand(
  conn: Client,
  command: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    conn.exec(command, (err, stream) => {
      if (err) return reject(err);
      if (!stream) return reject(new Error('No stream returned.'));

      stream
        .on('close', (code: string, signal: string) => {
          console.info(
            colors.magenta(
              `🛠️  Command finished (Code: ${code}, Signal: ${signal})`,
            ),
          );
          resolve();
        })
        .on('data', (data: Buffer) =>
          console.info(colors.gray(data.toString().trim())),
        )
        .stderr.on('data', (data: Buffer) =>
          console.error(colors.red(data.toString().trim())),
        );
    });
  });
}
