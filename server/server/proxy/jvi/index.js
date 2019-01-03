'use strict';

import jviWs from './jvi.ws';
// import { handler, getOrderbook, getMineral } from './jvi.handler';
import Event from './jvi.event';

let ws = null;

const jvi = {
  init: () => {
    ws = new jviWs(Event);
  },
  getOrderbook: () => Event.orderBook,
  getMineral: () => Event.mineral,
  clear: () => Event.clear(),
  stop: () => ws.close(),
  ping: () => ping()
};

export default jvi;