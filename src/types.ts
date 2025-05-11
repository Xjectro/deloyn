export interface DeloynConfig {
  serverIp: string;
  username: string;
  remotePath: string;
  sshKey: string;
  excluded?: string[];
  batchSize?: number;
  localPath?: string;
  scripts?: string[];
}

export {};
