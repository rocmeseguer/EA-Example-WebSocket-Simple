import { io, Socket } from "socket.io-client";
import { IMessage } from "./models/message";

const SERVER_URL = "http://localhost:3000";

const helloMessage: IMessage = {
    from: "Client",
    content: "Hello from the client!"
};

class WebSocketClient {
    private socket: Socket;

    constructor(serverUrl: string) {
        this.socket = io(serverUrl);
        this.initializeEvents();
    }

    private initializeEvents(): void {
        // Event when the client successfully connects to the server
        this.socket.on("connect", () => {
            console.info(`Connected to the server with id: ${this.socket.id}`);
        });

        // Handle disconnection
        this.socket.on("disconnect", () => {
            console.info("Disconnected from the server.");
        });

        // Custom event for handling messages
        this.socket.on("message", (msg: IMessage) => {
            console.info(`[client](message) Received message: ${msg.content}`);
        });
        
    }

    // Emit a "hello" message to the server
    public sendMessage(message: IMessage): void {
        this.socket.emit("message", message);
    }
}

// Instantiate the client and connect to the server
const client = new WebSocketClient(SERVER_URL);

// Example usage: Send a message to the server
setTimeout(() => {
    client.sendMessage(helloMessage);
}, 3000);
