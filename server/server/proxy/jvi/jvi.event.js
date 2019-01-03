
'use strict';

import ws from '~../server/ws';
import Coin from '~../server/components/coin';
import Upbit from '~../server/proxy/exchanges/upbit';
import Coinone from '~../server/proxy/exchanges/coinone';
import Bithumb from '~../server/proxy/exchanges/bithumb';
import service from '~../server/api/jtm/jtm.service';
import logger from '~../server/middlewares/logger';
import { isEmptyObject } from '~../server/components/utils';


const Event = class {
  constructor() {
    if (!Event.instance) {
      Event.instance = this;
    }
    this._isWorking = false;
    this._currency = {
      USD: ['gateio', 'bitfinex', 'binance'],
      BTC: ['binance/BTC', 'coinone/BTC', 'bitfinex/BTC', 'upbit/BTC'],
      KRW: ['bithumb', 'coinbit', 'coinone', 'upbit']
    }
    this._ticker = new Map();
    this._orderbookMap = { USD: {}, BTC: {}, KRW: {} };
    this._mineralMap = { USD: {}, BTC: {}, KRW: {} };
    return Event.instance;
  }
  get orderBook() {
    return this._orderbookMap;
  }
  get mineral() {
    return this._mineralMap;
  }
  getState() {
    if (this._isWorking) return true;
    else return false;
  }
  handler(msg) {
    try {
      let ticker = msg.ticker;
      if (ticker) {        
        this._isWorking = true;
        // update ticker 
        this._updateTicker(ticker);
        // clear data
        this._clear();
        // calculate        
        this._calculate();
        // send data              
        ws.broadcast({ type: 'ratio', data: this._orderbookMap });
        ws.broadcast({ type: 'mineral', data: this._mineralMap });
        this._isWorking = false;
      }
    } catch (err) {
      throw err;
    }
  };
  clear() {
    this._clear();
    this._ticker.clear();
  }
  _clear() {
    this._orderbookMap = { USD: {}, BTC: {}, KRW: {} };
    this._mineralMap = { USD: {}, BTC: {}, KRW: {} };
  }
  _getCurrency(val) {
    if (this._currency.BTC.includes(val)) return 'BTC';
    if (this._currency.KRW.includes(val)) return 'KRW';
    return 'USD';
  }
  /**
   * Median
   * @param {*} market 
   * @param {*} coin 
   * @param {*} data 
   */
  _organizeData(market, coin, data) {
    let currency = this._getCurrency(market);
    if (orderbookMap[currency][coin]) {
      let map = orderbookMap[currency][coin];
      map[market] = data;
      orderbookMap[currency][coin] = map;
    } else {
      let map = {};
      map[market] = data;
      orderbookMap[currency][coin] = map;
    }
  }
  /**
   * Entropi
   * @param {*} type 
   * @param {*} side 
   * @param {*} market 
   * @param {*} order 
   */
  _addMarket(type, side, market, order) {
    if (type[side][market]) {
      type[side][market] = order.amount;
    } else {
      type[side][market] = order.amount;
    }
    return type;
  }
  _addPrice(map, market, data) {
    for (let order of data) {
      if (map[order.price]) {
        let price = map[order.price];
        if (order.ab === 'a') map[order.price] = this._addMarket(price, 'ask', market, order);
        else map[order.price] = this._addMarket(price, 'bid', market, order);
      } else {
        let price = { ask: {}, bid: {} }
        if (order.ab === 'a') map[order.price] = this._addMarket(price, 'ask', market, order);
        else map[order.price] = this._addMarket(price, 'bid', market, order);
      }
    }
    return { map: map };
  }
  /**
   * sort
   * @param {*} market 
   * @param {*} coin 
   * @param {*} data 
   */
  _sortData(market, coin, data, a1, b1) {
    let currency = this._getCurrency(market);
    let map = {};
    let mineral = { min: 0, max: 0, orderbook: {}, orderbookFee: {} };
    if (this._orderbookMap[currency][coin]) {
      map = this._orderbookMap[currency][coin];
      mineral = this._mineralMap[currency][coin];
    }
    if (mineral.min === 0) {
      mineral.min = a1;
      mineral.max = b1;
    } else {
      if (a1 < mineral.min) mineral.min = a1;
      if (b1 > mineral.max) mineral.max = b1;
    }
    let res = this._addPrice(map, market, data);
    this._orderbookMap[currency][coin] = res.map;
    this._mineralMap[currency][coin] = mineral;
  }
  _setKeyVal(map, market, amount, price) {
    if (map[market]) {
      map[market].amount = map[market].amount + amount;
      map[market].sum = map[market].sum + Number(price) * amount;
    } else {
      map[market] = { amount: amount, sum: Number(price) * amount };
    }
    return map;
  }
  _findMax(obj) {
    if (Object.keys(obj).length === 1) {
      let key = Object.keys(obj)[0];
      return { market: key, amount: obj[key].amount, avg: (obj[key].sum / obj[key].amount) };
    } else {
      let market = null;
      let temp = 0;
      for (let key in obj) {
        if (temp < obj[key].amount) {
          market = key;
        }
      }
      return { market: market, amount: obj[market].amount, avg: (obj[market].sum / obj[market].amount) }
    }
  }
  _makeOrder(orderbook, askMarket, bidMarket, amount) {
    let askAmount = 0;
    let askPrice = 0;
    let askFee = 0;
    let bidAmount = 0;
    let bidPrice = 0;
    let bidFee = 0;
    // get ask order        
    for (let i = 0; i < orderbook.length; i++) {
      if (orderbook[i][1].ask[askMarket] && amount <= askAmount) {
        askAmount += orderbook[i][1].ask[askMarket].amount;
        askPrice = orderbook[i][1].ask[askMarket].price;
        askFee = orderbook[i][0];
        break;
      }
    }
    // get bid order
    for (let i = orderbook.length - 1; i > 0; i--) {      
      if (orderbook[i][1].bid[bidMarket] && amount <= bidAmount) {
        bidAmount += orderbook[i][1].bid[bidMarket].amount;
        bidPrice = orderbook[i][1].bid[bidMarket].price;
        bidFee = orderbook[i][0];
        break;
      }
    }
    return { amount: amount, buy: askMarket, buyPrice: askPrice, buyFee: askFee, sell: bidMarket, sellPrice: bidPrice, sellFee: bidFee };
  }
  _findAskBid(min, max, target, orderbook) {
    let order = { diff: 0 };    
    for (let i = 1; i < orderbook.length; i++) {
      let askMap = {};
      let bidMap = {};
      for (let j = 0; j < i; j++) {
        for (let market in orderbook[j][1].ask) {
          askMap = this._setKeyVal(askMap, market, orderbook[j][1].ask[market].amount, orderbook[j][0]);
        }
      }
      for (let k = i; k < orderbook.length; k++) {
        for (let market in orderbook[k][1].bid) {
          bidMap = this._setKeyVal(bidMap, market, orderbook[k][1].bid[market].amount, orderbook[k][0]);
        }
      }
      if (!isEmptyObject(askMap) && !isEmptyObject(bidMap)) {
        let askObj = this._findMax(askMap);
        let bidObj = this._findMax(bidMap);
        let askMarket = askObj.market;
        let askAmount = askObj.amount;
        let askAvg = askObj.avg;
        let bidMarket = bidObj.market;
        let bidAmount = bidObj.amount;
        let bidAvg = bidObj.avg;
        let diff = (bidAvg - askAvg) / askAvg * 100;
        let amount = askAmount;
        if (askAmount > bidAmount) amount = bidAmount;
        if (min < amount && diff > target) {
          if (amount > max) amount = max;
          if (askAmount > bidAmount) amount = bidAmount;
          if (diff > order.diff) {
            order = this._makeOrder(orderbook, askMarket, bidMarket, amount);
            order.diff = diff;
          }
        }
      }
    }    
    return order;
  }
  _addFeeMarket(order, market, amount, price) {
    order[market] = { amount: amount, price: price };
    return order;
  }
  _addFee(orderbookFee, type, market, price, fee, amount) {
    if (!orderbookFee[fee]) {
      orderbookFee[fee] = { ask: {}, bid: {} }
    }
    orderbookFee[fee][type] = this._addFeeMarket(orderbookFee[fee][type], market, amount, price);
    return orderbookFee;
  }
  _getFee(market, coin) {
    let activeCoin = Coin.activeCoin.get(`${market}-${coin}`);
    return activeCoin.taker * 0.01;
  }
  _createOrderbookFee(price, coin, orderbook, orderbookFee) {
    for (let market in orderbook.ask) {
      let fee = (Number(price) + (Number(price) * this._getFee(market, coin)))
      orderbookFee = this._addFee(orderbookFee, 'ask', market, price, fee, orderbook.ask[market])
    }
    for (let market in orderbook.bid) {
      let fee = (Number(price) - (Number(price) * this._getFee(market, coin)))
      orderbookFee = this._addFee(orderbookFee, 'bid', market, price, fee, orderbook.bid[market])
    }
    return orderbookFee;
  }
  async _order(market, coin, amount, price, type) {    
    switch (market) {
      case 'coinone':
        return await Coinone.order(coin, amount, price, type);
      case 'upbit':
        return await Upbit.order(coin, amount, price, type);
      case 'bithumb':
        return await Bithumb.order(coin, amount, price, type);
    }
  }
  async _trade(currency, coin, min, max, target, orderbook, order) {    
    try {
      order.buyId = await this._order(order.buy, coin, order.amount, order.buyPrice, 'ask');            
      if (order.buyId) {        
        order.sellId = await this._order(order.sell, order.amount, order.sellPrice, 'bid');
      }
    } catch (err) {
      // catch err, order cancel             
      logger.error(`order error : ${JSON.stringify(order)}`);            
    } finally {            
      logger.info(`signal ${currency} : ${coin} : ${min} : ${max} : ${target}`);
      logger.info(`signal order : ${JSON.stringify(order)}`);
      logger.info(`signal orderbook : ${JSON.stringify(orderbook)}`);
      // save log                   
      service.saveSignal(currency, coin, min, max, target, orderbook, order);
    }
  }
  _makeMineralData() {    
    for (let currency in this._mineralMap) {
      for (let coin in this._mineralMap[currency]) {
        let min = this._mineralMap[currency][coin].min;
        let max = this._mineralMap[currency][coin].max;
        let orderbookFee = {};
        for (let price in this._orderbookMap[currency][coin]) {
          // find mineral and standard price
          if (min <= price && max >= price) {
            let orderbook = this._orderbookMap[currency][coin][price];
            this._mineralMap[currency][coin].orderbook[price] = orderbook;
            orderbookFee = this._createOrderbookFee(price, coin, orderbook, orderbookFee); // add fee
          }
        } // end coin for
        let info = Coin.info.get(coin);
        // add fee
        // let sort = Object.entries(this._mineralMap[currency][coin].orderbook).sort((a, b) => a[0] - b[0]); // no fee
        let sort = Object.entries(orderbookFee).sort((a, b) => a[0] - b[0]);                
        this._mineralMap[currency][coin].orderbookFee = orderbookFee;
        // find amount
        let order = this._findAskBid(info.min, info.max, info.target, sort);
        // order        
        if(order.diff !== 0){
          this._trade(currency, info.id, info.min, info.max, info.target, this._mineralMap[currency][coin].orderbook, order);
          // debug 
          // for(let key of sort){
          //   console.log( key[0], key[1])
          // }
        }
      }
    }
  }
  _calculate() {    
    for (let [key, val] of this._ticker) {
      let arr = key.split('-'); // arr[0]: market, arr[1]: coin
      this._sortData(arr[0], arr[1], val.orderbook, val.a1, val.b1);
    }
    this._makeMineralData();
  }
  /**
   * Collecting only activated coins
   * @param {*} ticker 
   */
  _updateTicker(ticker) {    
    for (let key in ticker) {            
      if (Coin.activeCoin.has(key) && ticker[key].orderbook) {
        this._ticker.set(key, ticker[key]);
      }
    }
  }
}

const instance = new Event();

module.exports = instance;
