const ws = require('ws');

module.exports = class WebsocketServer {
    constructor (database) {
        this.wss = null;
        this.connections = new Set();
        this.database = database;
    }

    init ({ server }) {
        this.wss = new ws.Server({ server });
        this.wss.on('connection', this.onConnect.bind(this));
    }

    onConnect (ws_) {
        this.connections.add(ws_);

        ws_.on('message', function (msg) {
            // Receive update from sensors
            // Requires sensor ID and unit ID
            const { sensor, state: { type, value } } = JSON.parse(msg);
            // Fetch and update target device
            const target = this.database.query('FETCH_SENSOR_TARGET', sensor);
            ws_.send(JSON.stringify({
                target,
                type,
                value,
            }));
        });
    }
}