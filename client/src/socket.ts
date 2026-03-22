import { io, Socket } from "socket.io-client";
import { IMessage } from "./models/message";
import { serverUrl, logger } from "./config";

export const createSocket = (url: string): Socket => io(url);

export const setupSocketHandlers = (socket: Socket): void => {
    socket.on("connect", () => {
        logger.info({ socketId: socket.id }, 'Connected to server');
    });

    socket.on("disconnect", () => {
        logger.info('Disconnected from server');
    });

    socket.on("message", (msg: IMessage) => {
        logger.info({ from: msg.from, content: msg.content }, 'Message received');
    });
};

export const sendMessage = (socket: Socket, message: IMessage): void => {
    logger.info({ to: message.from, content: message.content }, 'Sending message');
    socket.emit("message", message);
};