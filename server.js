const http = require('http');

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
        const { url, method } = req;
        const route = url.slice(1);

        if (!this.routes.get(method).has(route)) {
            res.writeHead(404);
            res.end(JSON.stringify({
                code: 404,
                message: 'Invalid route or illegal request.',
            }));
        } else {
            const body = await this.readRequestBody(req);
            this.routes.get(method).get(route)(req, res, JSON.parse(body), this.database);
        }
    } 
}