'use strict';

import Ws from 'ws';
import { apiUrl } from './config.json';
// import { isWorking, clear } from './jvi.handler';

const jviWs = class {
  constructor(Event) {
    this._ws = new Ws(apiUrl);
    this._event = Event;
    this._connect();
  }
  _connect() {
    try {
      this._ws.on('open', () => this._sendCmd());
      this._ws.onclose = () => this._close();
      this._ws.onmessage = (msg) => {
        let data = msg.data;
        if (data && !this._event.getState()) {
          this._event.handler(JSON.parse(data));
        }
      }
    } catch (err) {
      throw err;
    }
  }
  _sendCmd() {
    let cmd = {
      subscribeOrderbook: true
    };
    this._ws.send(JSON.stringify(cmd));
  }
  _close() {
    console.log('disconnect');
  }
  close() {
    return this._ws.close();
  }
};

export default jviWs;
