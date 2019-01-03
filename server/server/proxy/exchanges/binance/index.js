import Exchange from './../index.js';

import Config from './config.json';
import binance from 'binance-api-node';

const Binance = class extends Exchange {
  constructor() {
    super()
    if (!Binance.instance) {
      Binance.instance = this;
    }
    this._client = binance({
      apiKey: Config.apiKey,
      apiSecret: Config.apiSecret,
    })
    return Binance.instance;
  }
  /**
   * Get coin balance
   * @param {*} coin 
   */
  async getAccount(coin) {
    try {
      let account = await this._client.accountInfo();
      let flag = 0;
      if (account.balances && account.balances.length > 0) {
        let balance = { updateTime: account.updateTime, USDT: 0 }
        for (let obj of account.balances) {
          if (obj.asset === 'USDT') { balance.USDT = obj.free; flag++; }
          else if (obj.asset === coin) { balance[coin] = obj.free; flag++; }
          if (flag === 2) break;
        }
        return balance;
      }
    } catch (err) {
      throw err;
    }
  }
}

const instance = new Binance();

module.exports = instance;