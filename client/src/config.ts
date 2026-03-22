import pino from 'pino';

export const serverUrl = process.env.SERVER_URL || 'http://localhost:4000';

export const logger = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
        },
    },
});