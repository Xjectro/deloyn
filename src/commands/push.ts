import { Client } from 'ssh2';
import SftpClient from 'ssh2-sftp-client';
import fs from 'fs-extra';
import colors from 'colors';
import type { DeloynConfig } from '../types';
import { uploadDirectory, executeRemoteCommand } from '../utils/ssh';

export async function push(config: DeloynConfig) {
  const {
    serverIp,
    username,
    remotePath,
    sshKey,
    excluded = [],
    batchSize = 5,
    scripts = [],
    localPath = process.cwd(),
  } = config;

  const EXCLUDED_FILES = new Set(excluded);
  let totalFilesUploaded = 0;
  let totalBytesUploaded = 0;

  const conn = new Client();
  const sftp = new SftpClient();
  const publishStart = Date.now();

  console.info(colors.yellow('🔌 Connecting to SSH...'));

  try {
    await new Promise<void>((resolve, reject) => {
      conn
        .on('ready', resolve)
        .on('error', reject)
        .connect({
          host: serverIp,
          username,
          privateKey: fs.readFileSync(sshKey, 'utf8'),
        });
    });

    console.log(colors.green('✅ SSH connected.'));

    await sftp.connect({
      host: serverIp,
      username,
      privateKey: fs.readFileSync(sshKey, 'utf8'),
    });

    console.log(colors.green('✅ SFTP connected.'));

    console.info(colors.red(`🧹 Removing remote dir: ${remotePath}`));
    await executeRemoteCommand(
      conn,
      `rm -rf ${remotePath} && mkdir -p ${remotePath}`,
    );

    const uploadStart = Date.now();
    console.info(colors.blue('📦 Starting file upload...'));

    await uploadDirectory(
      localPath,
      remotePath,
      sftp,
      EXCLUDED_FILES,
      batchSize,
      (size) => {
        totalFilesUploaded++;
        totalBytesUploaded += size;
      },
    );

    const uploadTime = (Date.now() - uploadStart) / 1000;

    console.log(
      colors.green(
        `⏱️ Upload completed in ${uploadTime.toFixed(
          2,
        )}s (${totalFilesUploaded} files, ${(
          totalBytesUploaded /
          1024 /
          1024
        ).toFixed(2)} MB)`,
      ),
    );

    console.info(colors.cyan('🚀 Running publishing commands...'));
    await executeRemoteCommand(
      conn,
      `cd ${remotePath} && ${scripts.join(
        ' && ',
      )} && echo "✅ Publishing complete."`,
    );

    const totalTime = (Date.now() - publishStart) / 1000;
    console.log(
      colors.green(`🎉 Publishing finished in ${totalTime.toFixed(2)}s`),
    );
  } catch (err) {
    console.error(colors.red('💥 Publishing failed: ' + err));
    throw err;
  } finally {
    try {
      await sftp.end();
      console.info(colors.yellow('📴 SFTP disconnected.'));
    } catch (e) {
      console.error(colors.red('⚠️ SFTP disconnect error: ' + e));
    }

    try {
      conn.end();
      console.info(colors.yellow('📴 SSH disconnected.'));
    } catch (e) {
      console.error(colors.red('⚠️ SSH disconnect error: ' + e));
    }
  }
}
