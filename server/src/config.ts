import pino, { Logger } from 'pino';

/**
 * API CONFIGURATION
 * Se lee el entorno una sola vez y se congela: el resto del código
 * recibe valores inmutables y ya tipados (number, no string | number).
 */
export interface IConfig {
    readonly port: number;
    readonly logLevel: string;
}

export const config: Readonly<IConfig> = Object.freeze({
    port: Number(process.env.PORT ?? 4000),
    logLevel: process.env.LOG_LEVEL ?? 'info',
});

/**
 * PINO LOGGER CONFIGURATION
 * Preferible a console.log: niveles (debug/info/warn/error) y logs
 * estructurados (objeto + mensaje). 'pino-pretty' los hace legibles en desarrollo.
 */
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
