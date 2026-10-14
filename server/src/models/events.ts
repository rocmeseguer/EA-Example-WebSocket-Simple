import { IMessage } from './message';

/**
 * CONTRATO DE EVENTOS (debe coincidir con client/src/models/events.ts)
 * Socket.io acepta genéricos para tipar nombre de evento + argumentos.
 * Por qué: un `emit("mesage", ...)` mal escrito o con payload incorrecto
 * pasa a ser un error de compilación en lugar de un bug silencioso.
 */

// Eventos que el SERVIDOR emite y el CLIENTE escucha
export interface ServerToClientEvents {
    welcome: (text: string) => void;
    message: (message: IMessage) => void;
}

// Eventos que el CLIENTE emite y el SERVIDOR escucha
export interface ClientToServerEvents {
    message: (payload: unknown) => void; // `unknown`: no confiamos en el cliente, se valida con isMessage
}
