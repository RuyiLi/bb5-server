import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { Server } from 'ws';
import { createConnection, Connection } from 'typeorm';


// HTTP Server
const httpServer = createExpressServer({
    controllers: [],
});


// Websocket Server
const ws = new Server({ server: httpServer });


// Database
const connection: Connection = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
});

httpServer.listen(process.env.PORT || 8080);