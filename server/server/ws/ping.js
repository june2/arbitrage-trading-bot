"use strict";

const ping = (wss, interval = 30 * 1000) =>
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) {
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping(() => null);
    });
  }, interval);

export default ping;