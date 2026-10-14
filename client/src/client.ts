import { createSocket, sendMessage, setupSocketHandlers, TypedSocket } from './socket';
import { config, logger } from './config';
import { IMessage } from './models/message';

// Función pura: mismo input -> mismo output, sin efectos secundarios
const createHelloMessage = (from: string): IMessage => ({
    from,
    content: `Hello from ${from}!`,
});

/**
 * Reaccionamos al evento 'connect' en lugar de esperar con setTimeout:
 * enviamos justo cuando hay conexión, ni antes (se perdería) ni tarde.
 */
const onConnect = (socket: TypedSocket): void =>
    sendMessage(socket, createHelloMessage(config.clientName));

const main = (): void => {
    logger.info({ serverUrl: config.serverUrl, clientName: config.clientName }, 'Starting client...');
    setupSocketHandlers(createSocket(config.serverUrl), onConnect);
};

main();
