import express, { Express, Request, Response, Router } from 'express';
import cors from 'cors';
import { TypedServer } from '../sockets/socket';
import { isMessage } from '../models/message';
import { logger } from '../config';

/**
 * GET /api/ping -> petición/respuesta clásica: el cliente pregunta, el servidor responde.
 */
const ping = (_req: Request, res: Response): void => {
    logger.debug('ping received');
    res.send('pong');
};

/**
 * POST /api/messages -> PUENTE REST -> WebSocket.
 * Una acción HTTP provoca un evento "push" a todos los clientes conectados.
 * En el proyecto, aquí iría primero el guardado con Mongoose y, si va bien, el emit.
 * Closure: `io` se inyecta como dependencia en lugar de importarse como global.
 */
const postMessage = (io: TypedServer) => (req: Request, res: Response): void => {
    const body: unknown = req.body;
    if (!isMessage(body)) {
        logger.warn({ body }, 'Invalid message received via REST');
        res.status(400).json({ error: 'Expected { from: string, content: string }' });
        return;
    }
    logger.info(body, 'Message received via REST, broadcasting to sockets');
    io.emit('message', body);
    res.status(201).json(body);
};

export const createApiRouter = (io: TypedServer): Router =>
    Router()
        .get('/ping', ping)
        .post('/messages', postMessage(io));

/**
 * Crea la app Express. El orden importa: los middlewares (cors, json)
 * deben registrarse ANTES que las rutas para que se apliquen a ellas.
 */
export const createApiApp = (io: TypedServer): Express =>
    express()
        .use(cors())
        .use(express.json())
        .use('/api', createApiRouter(io));
