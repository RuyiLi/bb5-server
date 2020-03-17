const Server = require('./server');
const WebsocketServer = require('./websockets');
const Database = require('./database');

const fs = require('fs');

require('dotenv').config();

const routes = new Map();
const routesDirectory = './routes/';
const SUPPORTED_METHODS = [ 'GET', 'PATCH', 'POST' ];

for (const method of SUPPORTED_METHODS) {
    routes.set(method, new Map());
}

for (const file of fs.readdirSync(routesDirectory)) {
    if (!file.endsWith('.js')) continue;
    const [ method, route ] = file.slice(0, -3).split('_'); 
    routes.get(method.toUpperCase()).set(route, require(routesDirectory + file));
}

const database = new Database();
database.init(process.argv.includes('-f')).then(function () {
    const server = new Server(routes, database);
    const wss = new WebsocketServer(database);
    server.init(process.env.PORT || 8080);
    wss.init(server);
});