import express, { Router } from 'express';
import { logger } from '../config';

export const createApiRouter = (): Router => {
    const router = Router();

    router.get('/ping', (_req, res) => {
        logger.info('ping received');
        res.send('pong');
    });

    router.get('/random', (_req, res) => {
        logger.info('random requested');
        res.send(String(Math.floor(Math.random() * 1000)));
    });

    return router;
};

export const createApiApp = () => {
    const app = express();
    app.use(express.json());
    app.use('/api', createApiRouter());
    return app;
};