import express from 'express';
import cors from 'cors';
import { createApiApp } from './api/api';
import initializeSocket from './sockets/socket';
import { apiPort, logger } from './config';

const app = createApiApp();

app.use(cors());

const server = app.listen(apiPort, () => {
    logger.info(`Server listening on port ${apiPort}`);
});

initializeSocket(server);
