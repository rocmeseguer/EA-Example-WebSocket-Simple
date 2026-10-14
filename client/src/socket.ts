import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './models/events';
import { IMessage } from './models/message';
import { logger } from './config';

// Ojo: en el cliente los genéricos van al revés (primero lo que ESCUCHA, después lo que EMITE)
export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const createSocket = (url: string): TypedSocket => io(url);

export const sendMessage = (socket: TypedSocket, message: IMessage): void => {
    logger.info(message, 'Sending message');
    socket.emit('message', message);
};

/**
 * Registra los handlers. `onConnect` se inyecta como parámetro (función de orden superior):
 * el módulo de sockets no necesita saber qué hace la aplicación al conectarse.
 */
export const setupSocketHandlers = (socket: TypedSocket, onConnect: (socket: TypedSocket) => void): void => {
    socket.on('connect', (): void => {
        logger.info({ socketId: socket.id }, 'Connected to server');
        onConnect(socket);
    });

    socket.on('welcome', (text: string): void => {
        logger.info(text);
    });

    socket.on('message', (message: IMessage): void => {
        logger.info(message, 'Message received (push from server)');
    });

    // Socket.io reintenta la conexión automáticamente tras una desconexión
    socket.on('disconnect', (reason: Socket.DisconnectReason): void => {
        logger.warn({ reason }, 'Disconnected from server');
    });
};
