import pino, { Logger } from 'pino';

/**
 * CLIENT CONFIGURATION
 * CLIENT_NAME permite lanzar varios clientes y distinguirlos en la demo.
 */
export interface IClientConfig {
    readonly serverUrl: string;
    readonly clientName: string;
    readonly logLevel: string;
}

export const config: Readonly<IClientConfig> = Object.freeze({
    serverUrl: process.env.SERVER_URL ?? 'http://localhost:4000',
    clientName: process.env.CLIENT_NAME ?? 'Client',
    logLevel: process.env.LOG_LEVEL ?? 'info',
});

export const logger: Logger = pino({
    level: config.logLevel,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
        },
    },
});
