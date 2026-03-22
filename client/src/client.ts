import { createSocket, setupSocketHandlers, sendMessage } from './socket';
import { serverUrl, logger } from './config';
import { IMessage } from './models/message';

const initializeClient = () => {
    const socket = createSocket(serverUrl);
    setupSocketHandlers(socket);
    return socket;
};

const createHelloMessage = (): IMessage => ({
    from: 'Client',
    content: 'Hello from the client!'
});

const main = () => {
    logger.info('Starting client...');
    const socket = initializeClient();

    setTimeout(() => {
        sendMessage(socket, createHelloMessage());
    }, 3000);
};

main();