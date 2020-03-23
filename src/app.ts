import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { createConnection, Connection } from 'typeorm';

import { DeviceController } from './controllers/DeviceController';
import { UnitController } from './controllers/UnitController';
import { UserController } from './controllers/UserController';

import { initWSS, getWSS } from './websocket';
import { SensorController } from './controllers/SensorController';

require('dotenv').config();

export const PORT = process.env.PORT || 8080;

(async function () {
    // HTTP Server
    const httpServer = createExpressServer({
        controllers: [ DeviceController, UnitController, UserController, SensorController ],
    });


    // Websocket Server
    initWSS(httpServer);


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
    console.info('Successfully connected to database.');


    httpServer.listen(PORT);
    console.info(`Listening on port ${PORT}.`);

    getWSS()!.init();
})();