import WebSocket from 'ws';
import { ratio, mineral } from './channel';

const sendToAll = (wss, data) => {
  try {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  } catch (err) {
    throw err;
  }
}

const sendToRatio = (data) => {
  try {    
    for (let [key, ws] of ratio.entries()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      } else {
        ratio.delete(key);
      }
    };
  } catch (err) {
    throw err;
  }
}

const sendToMineral = (data) => {
  try {
    for (let [key, ws] of mineral.entries()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      } else {
        mineral.delete(key);
      }
    };
  } catch (err) {
    throw err;
  }
}

export { sendToAll, sendToRatio, sendToMineral };
