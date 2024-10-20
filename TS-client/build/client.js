"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const SERVER_URL = "http://localhost:3000";
class WebSocketClient {
    constructor(serverUrl) {
        this.socket = (0, socket_io_client_1.io)(serverUrl);
        this.initializeEvents();
    }
    initializeEvents() {
        // Event when the client successfully connects to the server
        this.socket.on("connect", () => {
            console.info(`Connected to the server with id: ${this.socket.id}`);
        });
        // Handle disconnection
        this.socket.on("disconnect", () => {
            console.info("Disconnected from the server.");
        });
        // Custom event for handling "hello" messages
        this.socket.on("message", (msg) => {
            console.info(`Received hello message: ${msg}`);
        });
    }
    // Emit a "hello" message to the server
    sendMessage(message) {
        this.socket.emit("message", message);
    }
}
// Instantiate the client and connect to the server
const client = new WebSocketClient(SERVER_URL);
// Example usage: Send a message to the server
setTimeout(() => {
    client.sendMessage("Hello from the client!");
}, 3000);
