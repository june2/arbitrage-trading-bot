import axios from 'axios';
import Exchange from './../index.js';
import Config from './config.json';

const request = require("request")
const sign = require("jsonwebtoken").sign;
const queryEncode = require("querystring").encode;

const Upbit = class extends Exchange {
  constructor() {
    super()
    if (!Upbit.instance) {
      Upbit.instance = this;
    }
    this._api = 'https://api.upbit.com';
    this._apiKey = Config.apiKey;
    this._apiSecret = Config.apiSecret;
    return Upbit.instance;
  }
  _generateToken(query) {
    const payload = { access_key: this._apiKey, nonce: (new Date).getTime() };
    if (query) payload.query = queryEncode(query);
    const token = sign(payload, this._apiSecret);
    return token;
  }
  _generateOption(method, url, query) {
    let options = {
      method: method,
      url: url,
      headers: { Authorization: `Bearer ${this._generateToken(query)}` }
    };
    if (method === 'POST' && query) {
      options.json = query;
    }
    return options;
  }
  /**
   * Get coin balance
   * @param {*} coin 
   */
  async getAccount(coin) {
    try {
      let flag = 0;
      let res = await axios(this._generateOption('GET', `${this._api}/v1/accounts`));
      let balance = { KRW: 0 };
      balance[coin] = 0;
      for (let obj of res.data) {
        if (obj.currency === 'KRW') { balance.KRW = Number(obj.balance); flag++; }
        else if (obj.currency === coin) { balance[coin] = Number(obj.balance); flag++; }
        if (flag === 2) break;
      }
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
      return new Promise((resolve, reject) => {
        let query = {
          market: `${currency}-${coin}`,
          side: type,
          volume: amount,
          price: price,
          ord_type: 'limit'
        };
        let options = this._generateOption('POST', `${this._api}/v1/orders`, query);
        request(options, (err, response, rgResult) => {
          if (err) reject(err);
          if(rgResult && rgResult.uuid) return resolve(rgResult.uuid);
          else reject(rgResult);          
        });
      });
    } catch (err) {
      throw err;
    }
  }
  /**
   * get order info
   * @param {*} orderId 
   * @param {*} currency 
   */
  async getOrderInfo(orderId) {
    try {
      return new Promise((resolve, reject) => {
        let query = { uuid: orderId };
        let options = this._generateOption('GET', `${this._api}/v1/orders?${queryEncode(query)}`, query);
        request(options, (err, response, rgResult) => {
          if (err) reject(err);
          resolve(JSON.parse(rgResult));
        });
      });
    } catch (err) {
      throw err;
    }
  }
  /**
   * cancel order
   * @param {*} orderId 
   */
  async cancelOrder(orderId){
    try {
      return new Promise((resolve, reject) => {
        let query = { uuid: orderId };
        let options = this._generateOption('DELETE', `${this._api}/v1/order?${queryEncode(query)}`, query);
        request(options, (err, response, rgResult) => {
          if (err) reject(err);
          resolve(JSON.parse(rgResult));
        });
      });
    } catch (err) {
      throw err;
    }
  }
}

const instance = new Upbit();

module.exports = instance;