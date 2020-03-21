import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { Server } from 'ws';
import { createConnection, Connection } from 'typeorm';

import { DeviceController } from './controllers/DeviceController';
import { UnitController } from './controllers/UnitController';
import { UserController } from './controllers/UserController';

require('dotenv').config();

(async function () {
    // HTTP Server
    const httpServer = createExpressServer({
        controllers: [ DeviceController, UnitController, UserController ],
    });


    // Websocket Server
    const ws = new Server({ server: httpServer });


    // Database
    const connection: Connection = await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: true,
        synchronize: process.argv.includes('--sync'),
        logging: process.env.ENVIRONMENT === 'dev',
        entities: [ __dirname + '/entity/*.js' ],   
        // .js since when compiled with tsc the entity declarations
        // will be in js, not ts.
    });

    httpServer.listen(process.env.PORT || 8080);
})();