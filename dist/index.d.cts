#!/usr/bin/env node
interface DeloynConfig {
    serverIp: string;
    username: string;
    remotePath: string;
    sshKey: string;
    excluded?: string[];
    batchSize?: number;
    localPath?: string;
    scripts?: string[];
}

declare function defineConfig(config: DeloynConfig): DeloynConfig;

export { type DeloynConfig, defineConfig };
