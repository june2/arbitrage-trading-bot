import Exchange from './../index.js';

const binance = require('binance-api-node').default

let instance = null;

const Binance = class extends Exchange {
  constructor(apiKey, apiSecret) {
    if (!instance) { instance = this; }
    this._client = binance({
      apiKey: apiKey,
      apiSecret: apiSecret,
    })
    return instance;
  }
  getAccount() {

  }
}

module.exports = new Binance();