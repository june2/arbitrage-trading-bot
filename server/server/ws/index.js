import WebSocket from 'ws';
import ping from './ping';
import { eventHandler } from './handler';
import { sendToAll, sendToRatio, sendToMineral } from './sender';

const obj = {
  wss: null,
  init: (port) => {
    return obj.wss ? obj.wss : obj.createWs(port);
  },
  createWs: (port) => {
    obj.wss = new WebSocket.Server({ port: port });
    obj.wss.on('connection', (ws, req) => {
      ws.req = req;
      ws.isAlive = true;
      ws.on("pong", () => (ws.isAlive = true));
      ws.on("message", (event) => {
        eventHandler(event, ws);
      });
    });
    ping(obj.wss, 1000 * 3);
    return () => { };
  },
  broadcast: ({ type, data }) => {
    switch (type) {
      case 'ratio':
        sendToRatio(data);
        break;
      case 'mineral':
        sendToMineral(data);
        break;
    }
  }
};

export default obj;
