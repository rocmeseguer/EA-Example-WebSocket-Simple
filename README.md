# Ejemplo de Socket.io

## Tecnologías utilizadas

- **Socket.io**: Una librería JavaScript para la comunicación bidireccional en tiempo real entre clientes y servidores web.
- **Node.js**: Un entorno de ejecución de JavaScript que permite ejecutar JavaScript en el lado del servidor.
- **TypeScript**: Lenguaje de programación de alto nivel gratuito y de código abierto que añade tipado estático a JavaScript.
- **Express.js**: Un marco de aplicaciones web rápido y minimalista para Node.js.
- **Git**: Un sistema de control de versiones para el seguimiento de los cambios en el proyecto.

## Estructura del proyecto

```
├── server
│   ├── src
│   │   ├── models
│   │   ├── sockets
│   │   └── index.ts
│   ├── package.json    
│   └── tsconfig.json
├── client
│   ├── src
│   │   ├── models
│   │   └── client.ts
│   ├── package.json    
│   └── tsconfig.json
├── .gitignore
├── LICENSE
└── README.md
```

## Server

Abrir un nuevo terminal
```
cd server
```

### Instalar todas las dependencias
```
npm install
```

### Ejecutar
```
tsc
node build/index.js
```

## Client
Abrir un nuevo terminal
```
cd client

```
### Instalar todas las dependencias
```
npm install
```

### Ejecutar
```
tsc
node build/client.js
```