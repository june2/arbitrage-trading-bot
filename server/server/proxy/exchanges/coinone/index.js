import axios from 'axios';
import crypto from 'crypto';
import Exchange from './../index.js';
import Config from './config.json';

const Coinone = class extends Exchange {
  constructor() {
    super()
    if (!Coinone.instance) {
      Coinone.instance = this;
    }
    this._api = 'https://api.coinone.co.kr';
    this._apiKey = Config.apiKey;
    this._apiSecret = Config.apiSecret;
    return Coinone.instance;
  }
  _generateOption(params) {
    let payload = {
      'access_token': this._apiKey,
      'nonce': Date.now()
    };
    if (params) {
      for (let o in params) {
        payload[o] = params[o];
      }
    }
    payload = new Buffer(JSON.stringify(payload)).toString('base64');
    const signature = crypto
      .createHmac("sha512", this._apiSecret.toUpperCase())
      .update(payload)
      .digest('hex');
    const headers = {
      'accept': 'application/json',
      'content-type': 'application/json',
      'X-COINONE-PAYLOAD': payload,
      'X-COINONE-SIGNATURE': signature
    };
    return {
      headers: headers,
      body: payload
    };
  }
  /**
   * Get coin balance
   * @param {*} coin 
   */
  async getAccount(coin) {
    try {
      let res = await axios.post(`${this._api}/v2/account/balance/`, {}, this._generateOption());
      let balance = { KRW: Number(res.data.krw.avail) };
      balance[coin] = 0;
      if (res.data[coin]) balance[coin] = Number(res.data[coin].avail);
      return balance;
    } catch (err) {
      throw err;
    }
  }
  /**
   * order
   * @param {*} coin 
   * @param {*} amount 
   * @param {*} price 
   * @param {*} type 
   * @param {*} currency 
   */
  async order(coin, amount, price, type, currency = 'KRW') {
    try {
      let api = `${this._api}/v2/order/limit_buy/`;
      if (type === 'ask') api = `${this._api}/v2/order/limit_sell/`;
      let params = {
        price: price,
        qty: amount,
        currency: coin
      };
      let res = await axios.post(`${api}`, {}, this._generateOption(params));      
      if(res.data && res.data.result === 'success') return res.data.orderId;
      else throw res.data;
    } catch (err) {      
      throw err;
    }
  }
  /**
   * get order info
   * @param {*} orderId 
   * @param {*} currency 
   */
  async getOrderInfo(orderId, currency) {
    try {
      let api = `${this._api}/v2/order/order_info/`;
      let params = {
        order_id: orderId,
        currency: currency
      };
      let res = await axios.post(`${api}`, {}, this._generateOption(params));
      return res.data;
    } catch (err) {
      throw err;
    }
  }
  /**
   * cancel order info
   * @param {*} orderId 
   * @param {*} price 
   * @param {*} qty 
   * @param {*} currency 
   * @param {*} isAsk 
   */
  async cancelOrder(orderId, price, qty, currency, isAsk = 1) {
    try {
      let api = `${this._api}/v2/order/cancel/`;
      let params = {
        order_id: orderId,
        price: price,
        qty: qty,
        currency: currency,
        is_ask: isAsk,
        currency: currency
      };
      let res = await axios.post(`${api}`, {}, this._generateOption(params));
      return res.data;
    } catch (err) {
      throw err;
    }
  }
}

const instance = new Coinone();

module.exports = instance;