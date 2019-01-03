import axios from 'axios';
import api from './api';

class JtmService {
  constructor() {
    this._api = api('');
  }
  async getVersion() {
    return await this._api.get('');
  }
  async getBalances(currency, coin) {
    return await this._api.get(`exchanges/balances?currency=${currency}&coin=${coin}`);
  }
  async getSignals(currency, coinId) {    
    return await this._api.get(`jtm/signals?currency=${currency}&coinId=${coinId}`);
  }
  async startJtm() {
    return await this._api.get('jtm/start');
  }
  async stopJtm() {
    return await this._api.get('jtm/stop');
  }
  async getCoins(currency) {
    return await this._api.get(`jtm/coins?currency=${currency}`);
  }
  async updateMarketcoins(params) {
    return await this._api.update(`jtm/marketcoins`, params);
  }
}

export default new JtmService();