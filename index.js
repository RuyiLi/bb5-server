const Server = require('./server');
const WebsocketServer = require('./websockets');
const Database = require('./database');

const fs = require('fs');

require('dotenv').config();

const routes = new Map();
const SUPPORTED_METHODS = [ 'GET', 'PATCH' ];

for (const method of SUPPORTED_METHODS) {
    routes.set(method, new Map());
}

for (const file of fs.readdirSync('./routes')) {
    if (!file.endsWith('.js')) continue;
    const [ method, route ] = file.slice(0, -3).split('_'); 
    routes.get(method).set(route, require(file));
}

const database = new Database();
database.init(process.argv.includes('-f')).then(function () {
    const server = new Server(routes, database);
    const wss = new WebsocketServer(database);
    server.init(8080);
    wss.init(5000);
});