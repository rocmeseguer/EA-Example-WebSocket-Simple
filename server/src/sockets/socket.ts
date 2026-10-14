import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '../models/events';
import { isMessage } from '../models/message';
import { logger } from '../config';

// Alias tipados: todo el código comparte el mismo contrato de eventos
export type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

/**
 * Crea el servidor Socket.io SIN adjuntarlo todavía a un servidor HTTP.
 * Por qué: así la API REST puede recibir `io` como dependencia antes de que
 * exista el servidor HTTP (ver index.ts), sin dependencias circulares.
 */
export const createSocketServer = (): TypedServer =>
    new Server<ClientToServerEvents, ServerToClientEvents>({
        cors: { origin: '*' }, // Solo para la demo: en producción, restringir el origen
    });

/**
 * Handler de un mensaje entrante.
 * Ilustra los tres "alcances" de emisión de Socket.io:
 *   socket.emit           -> solo al cliente que envía
 *   socket.broadcast.emit -> a todos MENOS al que envía
 *   io.emit               -> a TODOS los clientes conectados
 */
const handleMessage = (io: TypedServer, socket: TypedSocket) => (payload: unknown): void => {
    if (!isMessage(payload)) {
        logger.warn({ clientId: socket.id, payload }, 'Invalid message discarded');
        return;
    }
    logger.info({ clientId: socket.id, ...payload }, 'Message received via WebSocket');
    io.emit('message', payload);
};

/**
 * Registra los handlers de cada conexión.
 * Cada handler es una función pequeña, lo que facilita leerlos y testearlos por separado.
 */
const handleConnection = (io: TypedServer) => (socket: TypedSocket): void => {
    logger.info({ clientId: socket.id }, 'Client connected');

    socket.emit('welcome', `Welcome! Your id is ${socket.id}`);
    socket.on('message', handleMessage(io, socket));

    // Socket.io ya ha cerrado la conexión: solo registramos el evento
    socket.on('disconnect', (reason: string): void => {
        logger.info({ clientId: socket.id, reason }, 'Client disconnected');
    });
};

export const registerSocketHandlers = (io: TypedServer): void => {
    io.on('connection', handleConnection(io));
};
