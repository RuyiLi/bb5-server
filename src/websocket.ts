import * as ws from 'express-ws';
import { getConnectedUser } from './controllers/DeviceController';


export enum WebSocketMessageType {
    IDENTIFY                = 0,
    DEVICE_STATE_UPDATE     = 1,
}

let wss: WebSocketServer | null = null;

export const getWSS = () => wss;
export const initWSS = (server: any) => {
    wss = new WebSocketServer(server);
}

class WebSocketServer {

    public connections: Map<string, any>;

    constructor (public server: any) {
        ws(server);
        this.connections = new Map();
    }

    init () {
        this.server.ws('/listen', this.handleConnection); 
        console.info('WSS started.');
    }

    handleConnection = (ws: any) => {
        ws.on('message', (message: string) => {
            try {
                var { type, content } = JSON.parse(message);
            } catch {
                ws.send('Please stringify your object before sending it.')
            }
            
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
