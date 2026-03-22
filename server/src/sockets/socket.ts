import SocketIO from "socket.io";
import * as http from "http";
import { IMessage } from "../models/message";
import { logger } from "../config";

const createSocketServer = (server: http.Server) => {
    return new SocketIO.Server(server, {
        cors: {
            origin: "*"
        }
    });
};

const initializeSocket = (server: http.Server) => {
    const io = createSocketServer(server);
    io.on('connection', (socket: SocketIO.Socket) => {
      logger.info({ clientId: socket.id }, 'Client connected');

      socket.on("message", (m: IMessage) => {
          logger.info({ from: m.from, content: m.content }, 'Message received');
          socket.emit("message", m);
      });
  
      socket.on('disconnect', () => {
          logger.info({ clientId: socket.id }, 'Client disconnected');
          socket.disconnect();
      });
    });
};

export default initializeSocket;