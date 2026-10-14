import { IMessage } from './message';

/**
 * CONTRATO DE EVENTOS (espejo de server/src/models/events.ts)
 * Mismos nombres de interfaz que en el servidor, vistos desde el cliente.
 */

// Eventos que el SERVIDOR emite y el CLIENTE escucha
export interface ServerToClientEvents {
    welcome: (text: string) => void;
    message: (message: IMessage) => void;
}

// Eventos que el CLIENTE emite y el SERVIDOR escucha
export interface ClientToServerEvents {
    message: (message: IMessage) => void;
}
