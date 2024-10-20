import express from 'express'
import cors from 'cors'
import initializeSocket from './sockets/socket';

const app = express()
app.use(express.json())

app.use(cors());

// example on how to serve a simple API
app.get('/ping', (_req , res) => {
    console.log('ping')
    res.send('pong')
})

app.get("/random", (req, res) => {
    console.log('random');
    res.send((Math.floor(Math.random() * 1000)).toString());
})

const PORT = 3000;

const server = app.listen(PORT, () => {
    console.log('el servidor esta escuchando en el puerto '+ PORT)
})

initializeSocket(server);
