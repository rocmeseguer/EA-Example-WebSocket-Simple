# Ejemplo de Socket.io sobre una API REST

Demostración mínima de cómo añadir **comunicación bidireccional en tiempo real** (Socket.io)
a una **API REST** (Express + TypeScript), siguiendo un estilo **funcional** y con **tipado estricto**.

## Tecnologías utilizadas

- **Socket.io**: comunicación bidireccional en tiempo real entre clientes y servidor.
- **Express.js**: framework minimalista para la API REST.
- **Node.js** + **TypeScript** (`strict: true`).
- **Pino**: logger estructurado (con `pino-pretty` en desarrollo).

## Conceptos

### 1. REST vs WebSocket

| | REST (HTTP) | WebSocket (Socket.io) |
|---|---|---|
| Quién inicia | Siempre el cliente | Cualquiera de los dos |
| Conexión | Una por petición | Persistente |
| Modelo | Petición → respuesta | Eventos (`emit` / `on`) |
| Uso típico | CRUD (`GET /users`) | Chat, notificaciones, actualizaciones en vivo |

Con REST, el cliente tiene que **preguntar** (polling) para saber si hay novedades.
Con WebSocket, el servidor **empuja** (*push*) los datos en cuanto ocurren.
No se sustituyen: **se complementan**.

### 2. Un único servidor HTTP para ambos

Express y Socket.io comparten servidor y puerto (`server/src/index.ts`). Socket.io intercepta
las peticiones de *upgrade* a WebSocket y el resto las atiende Express.

```ts
const io = createSocketServer();        // Socket.io, todavía sin puerto
const app = createApiApp(io);           // la API recibe `io` como dependencia
const httpServer = createServer(app);
io.attach(httpServer);                  // ambos sobre el mismo servidor
```

### 3. Puente REST → WebSocket

Es el patrón que usaréis en el proyecto: **una petición REST cambia el estado y se notifica a
todos los clientes conectados**. En `server/src/api/api.ts`:

```ts
// POST /api/messages
io.emit('message', body);       // push a todos los sockets
res.status(201).json(body);     // respuesta HTTP al que hizo la petición
```

Con Mongoose, el orden sería: validar → `await Model.create(...)` → `io.emit(...)` → responder.
Solo se notifica lo que se ha guardado correctamente.

### 4. Alcance de una emisión

| Llamada | Quién lo recibe |
|---|---|
| `socket.emit(...)` | Solo ese cliente (ej.: `welcome`) |
| `socket.broadcast.emit(...)` | Todos **menos** ese cliente |
| `io.emit(...)` | **Todos** los clientes conectados |

### 5. Eventos tipados (contrato cliente-servidor)

`models/events.ts` define qué eventos existen y qué argumentos llevan. Socket.io acepta esas
interfaces como genéricos:

```ts
Server<ClientToServerEvents, ServerToClientEvents>   // servidor: escucha, emite
Socket<ServerToClientEvents, ClientToServerEvents>   // cliente: al revés
```

Así, un nombre de evento mal escrito o un payload incorrecto se convierte en un **error de compilación**.
El contrato está duplicado en `server` y `client` (deben mantenerse iguales); en un proyecto
real se movería a un paquete compartido.

### 6. Validar en tiempo de ejecución

Los tipos de TypeScript **desaparecen al compilar**: un cliente puede enviar cualquier cosa.
Por eso el servidor recibe `unknown` y lo valida con un *type guard* (`isMessage`), tanto en
REST como en WebSocket. Si no es válido, se registra con `logger.warn` y se descarta (o se
responde `400`).

### 7. Estilo funcional aplicado

- **Inmutabilidad**: interfaces `readonly` y configuración con `Object.freeze`.
- **Funciones puras** donde se puede (`isMessage`, `createHelloMessage`).
- **Inyección de dependencias por parámetros / closures**: `postMessage(io)`, `handleMessage(io, socket)`.
  No hay variables globales mutables y cada pieza es fácil de testear.
- **Funciones de orden superior**: el cliente recibe `onConnect` como parámetro.
- **Efectos secundarios en los bordes**: emitir, loguear y escuchar se hacen en handlers pequeños y explícitos.
- **Reaccionar a eventos** en lugar de esperar con `setTimeout`: el cliente envía su mensaje al recibir `connect`.

### 8. Logger

Se usa `logger` (Pino) en lugar de `console.log`: niveles (`debug`, `info`, `warn`, `error`)
y logs estructurados (`logger.info({ clientId }, 'Client connected')`).
El nivel se cambia con `LOG_LEVEL`, por ejemplo `LOG_LEVEL=debug npm start` para ver los `ping`.

## Estructura del proyecto

```
├── server
│   ├── src
│   │   ├── api
│   │   │   └── api.ts          # Rutas REST + puente REST → WebSocket
│   │   ├── models
│   │   │   ├── events.ts       # Contrato de eventos tipado
│   │   │   └── message.ts      # IMessage + type guard isMessage
│   │   ├── sockets
│   │   │   └── socket.ts       # Servidor Socket.io y handlers
│   │   ├── config.ts           # Configuración y logger
│   │   └── index.ts            # Composición: HTTP + Express + Socket.io
│   ├── package.json
│   └── tsconfig.json
├── client
│   ├── src
│   │   ├── models
│   │   │   ├── events.ts
│   │   │   └── message.ts
│   │   ├── config.ts
│   │   ├── socket.ts           # Conexión y handlers del cliente
│   │   └── client.ts           # Punto de entrada
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
├── LICENSE
└── README.md
```

## Ejecutar la demo

### Servidor (terminal 1)
```
cd server
npm install
npm run build
npm start
```

### Clientes (terminales 2 y 3)
```
cd client
npm install
npm run build
CLIENT_NAME=Ana npm start
```
En otra terminal: `CLIENT_NAME=Bob npm start`. Cada cliente envía un saludo al conectarse y
ambos lo reciben (`io.emit`).

### Disparar un evento desde REST (terminal 4)
```
curl -X POST http://localhost:4000/api/messages \
     -H "Content-Type: application/json" \
     -d '{"from":"REST","content":"Hola desde curl"}'
```
Los dos clientes reciben el mensaje **sin haberlo pedido**: eso es el *push*.

Prueba también un payload inválido (`-d '{"foo":1}'`): responde `400` y el servidor lo registra con `warn`.

### Variables de entorno

| Variable | Dónde | Por defecto |
|---|---|---|
| `PORT` | server | `4000` |
| `SERVER_URL` | client | `http://localhost:4000` |
| `CLIENT_NAME` | client | `Client` |
| `LOG_LEVEL` | ambos | `info` |
