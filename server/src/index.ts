import { createServer, Server as HttpServer } from 'http';
import { Express } from 'express';
import { createApiApp } from './api/api';
import { createSocketServer, registerSocketHandlers, TypedServer } from './sockets/socket';
import { config, logger } from './config';

/**
 * COMPOSICIÓN (punto de entrada)
 * Express y Socket.io comparten el MISMO servidor HTTP y el mismo puerto:
 * HTTP atiende las peticiones REST y Socket.io "secuestra" (upgrade) las conexiones WebSocket.
 * Pasos lineales, sin estado global: cada pieza recibe lo que necesita como argumento.
 */
const io: TypedServer = createSocketServer();      // 1. Socket.io (aún sin puerto)
const app: Express = createApiApp(io);              // 2. API REST, que puede emitir por `io`
const httpServer: HttpServer = createServer(app);   // 3. Servidor HTTP con la app Express

io.attach(httpServer);                              // 4. Socket.io escucha en el mismo servidor
registerSocketHandlers(io);                         // 5. Handlers de eventos WebSocket

httpServer.listen(config.port, (): void => {
    logger.info(`Server listening on http://localhost:${config.port}`);
});
