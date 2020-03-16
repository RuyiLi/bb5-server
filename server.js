const http = require('http');
const url = require('url');
const qs = require('querystring');

module.exports = class Server {
    constructor (routes, database) {
        this.server = null;
        this.routes = routes;
        this.database = database;
    }

    init (port) {
        this.server = http.createServer(this.requestHandler.bind(this)).listen(port, function () {
            console.log(`Listening on http://localhost:${port}`);
        });
    }

    readRequestBody (req) {
        return new Promise(function (resolve) {
            const chunks = [];
            req.on('data', function (chunk) {
                chunks.push(chunk);
            }).on('end', function () {
                resolve(Buffer.concat(chunks).toString());
            });
        });
    }

    async requestHandler (req, res) {
        const { pathname, query } = url.parse(req.url);
        const route = pathname.slice(1);

        if (!this.routes.get(req.method).has(route)) {
            res.writeHead(404);
            res.end(JSON.stringify({
                code: 404,
                message: 'Invalid route or illegal request.',
            }));
        } else {
            const queryParams = qs.parse(query);
            this.routes.get(req.method).get(route)(req, res, queryParams, this.database);
        }
    } 
}