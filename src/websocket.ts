import { Server, ServerOptions } from 'ws';
import WebSocket = require('ws');
import { getConnectedUser } from './controllers/DeviceController';

export enum WebSocketMessageType {
    IDENTIFY                = 0,
    DEVICE_STATE_UPDATE     = 1,
}

let wss: WebSocketServer | null = null;

export const getWSS = () => wss;
export const initWSS = (server: any) => wss = new WebSocketServer({ server });

class WebSocketServer extends Server {

    public connections: Map<string, WebSocket>;

    constructor (options: ServerOptions) {
        super(options);
        this.connections = new Map();
    }

    init () {
        this.on('connection', this.handleConnection); 
    }

    handleConnection = (ws: WebSocket) => {
        this.on('message', (message) => {
            const { type, content } = JSON.parse(message);
            switch (type) {

                case WebSocketMessageType.IDENTIFY:
                    // IDENTIFY message should be sent right after connection.
                    this.connections.set(content.userId, ws);
                    break;

            }
        });
    }

    async broadcastMessage (type: WebSocketMessageType, args: any) {
        switch (type) {
            
            case WebSocketMessageType.DEVICE_STATE_UPDATE:
                // 
                const { deviceId, stateType, stateValue } = args;
                try {
                    const userId = await getConnectedUser(deviceId);
                    if (!this.connections.has(userId)) throw new Error('Client has not sent IDENTIFY websocket message.');
                    this.connections.get(userId)!.send(JSON.stringify({ 
                        deviceId,
                        stateType,
                        stateValue,
                    }));
                } catch (err) {
                    // Silently fail, don't send anything to websocket
                    console.error(err);
                }
                break;

        }
    }

} 
