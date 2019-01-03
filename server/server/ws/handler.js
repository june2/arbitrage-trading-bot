import { ratio, mineral } from './channel';

const eventHandler = (event, ws) => {
  try {
    let { method, param } = JSON.parse(event);
    switch (method) {
      case 'subscribe':
        switch (param) {
          case 'ratio':            
            ratio.set(ws.req.headers['sec-websocket-key'], ws); break;
          case 'mineral':
            mineral.set(ws.req.headers['sec-websocket-key'], ws); break;
        }
        break;
    }
  } catch (err) {
    // ws.send(err);
  }
}

export { eventHandler };
