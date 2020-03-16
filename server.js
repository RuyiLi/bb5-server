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
        return Promise.resolve(function (resolve) {
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
        
        console.log(this.routes.get(method), route);

        if (!this.routes.get(method).has(route)) {
            res.writeHead(404).end('asdf');
        } else {
            const body = await this.readRequestBody(req);
            this.routes.get(method).get(route)(req, res, body, this.database);
        }
    } 
}