import axios from 'axios';
import Exchange from './../index.js';
import Config from './config.json';
var FormData = require('form-data');

const request = require('request');
const CryptoJS = require("crypto-js");

const Bithumb = class extends Exchange {
  constructor() {
    super()
    if (!Bithumb.instance) {
      Bithumb.instance = this;
    }
    this._api = 'https://api.bithumb.com';
    this._apiKey = Config.apiKey;
    this._apiSecret = Config.apiSecret;
    return Bithumb.instance;
  }
  _generateToken() {
    const payload = { access_key: this._apiKey, nonce: (new Date).getTime() };
    const token = sign(payload, this._apiSecret);
    return token;
  }
  _httpBuildQuery(obj) {
    let output_string = [];
    Object.keys(obj).forEach(function (val) {
      let key = val;
      key = encodeURIComponent(key.replace(/[!'()*]/g, escape));
      if (typeof obj[val] === 'object') {
        let query = build_query(obj[val], null, key)
        output_string.push(query)
      }
      else {
        let value = encodeURIComponent(obj[val].replace(/[!'()*]/g, escape));
        output_string.push(key + '=' + value)
      }
    })
    return output_string.join('&');
  }
  _microtime(float) {
    let now = new Date().getTime() / 1000;
    let s = parseInt(now, 10);
    return (float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
  }
  _usecTime() {
    let rgMicrotime = this._microtime().split(' '), usec = rgMicrotime[0], sec = rgMicrotime[1];
    usec = usec.substr(2, 3);
    return Number(String(sec) + String(usec));
  }
  _chr(codePt) {
    if (codePt > 0xFFFF) {
      codePt -= 0x10000;
      return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
    }
    return String.fromCharCode(codePt);
  }
  _base64Encode(data) {
    let b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = '', tmp_arr = [];
    if (!data) { return data; }
    do { // pack three octets into four hexets
      o1 = data.charCodeAt(i++);
      o2 = data.charCodeAt(i++);
      o3 = data.charCodeAt(i++);
      bits = o1 << 16 | o2 << 8 | o3;
      h1 = bits >> 18 & 0x3f;
      h2 = bits >> 12 & 0x3f;
      h3 = bits >> 6 & 0x3f;
      h4 = bits & 0x3f;
      // use hexets to index into b64, and append result to encoded string
      tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);
    enc = tmp_arr.join('');
    let r = data.length % 3;
    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
  }
  _getHttpHeaders(endPoint, rgParams, api_key, api_secret) {
    let strData = this._httpBuildQuery(rgParams);
    let nNonce = this._usecTime();
    return {
      'Api-Key': api_key,
      'Api-Sign': (this._base64Encode(CryptoJS.HmacSHA512(endPoint + this._chr(0) + strData + this._chr(0) + nNonce, api_secret).toString())),
      'Api-Nonce': nNonce
    };
  }
  async _apiCall(endPoint, params) {
    return new Promise((resolve, reject) => {
      let rgParams = { 'endPoint': endPoint };
      if (params) {
        for (let o in params) {
          rgParams[o] = params[o];
        }
      }
      let options = {
        method: 'POST',
        uri: `${this._api + endPoint}`,
        headers: this._getHttpHeaders(endPoint, rgParams, this._apiKey, this._apiSecret),
        formData: rgParams
      };
      request(options, (err, response, rgResult) => {        
        if (err) reject(err);
        resolve(JSON.parse(rgResult));
      });
    });
  }
  /**
   * Get coin balance
   * @param {*} coin 
   */
  async getAccount(coin) {
    try {
      let rgParams = { currency: coin ? coin : 'ALL' };
      // let res = await this._apiCall('/info/account', rgParams);
      let res = await this._apiCall('/info/balance', rgParams);
      if (res.status !== '0000') throw new Error(res.message);
      let balance = { KRW: res.data.available_krw };
      balance[coin] = 0;
      if (res.data[`available_${coin.toLowerCase()}`]) balance[coin] = Number(res.data[`available_${coin.toLowerCase()}`]);
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
      let rgParams = {
        order_currency: coin,
        payment_currency: currency,
        units: amount,
        price: price,
        type: type
      };
      let res = await this._apiCall('/trade/place', rgParams);
      if (res && res.status === '0000') return res.order_id;
      else throw res;
    } catch (err) {
      throw err;
    }
  }
  /**
   * get order info (체결 내역만 조회 가능)
   * @param {*} orderId 
   * @param {*} currency 
   */
  async getOrderInfo(orderId, currency, type) {
    try {
      let rgParams = {
        order_id: orderId,
        currency: currency,
        type: type
      };
      return await this._apiCall('/info/order_detail', rgParams);
    } catch (err) {
      throw err;
    }
  }
  /**
   * cancel order
   * @param {*} orderId 
   */
  async cancelOrder(orderId, currency, type) {
    try {
      let rgParams = {
        order_id: orderId,
        currency: currency,
        type: type
      };
      return await this._apiCall('/trade/cancel', rgParams);
    } catch (err) {
      throw err;
    }
  }
}

const instance = new Bithumb();

module.exports = instance;