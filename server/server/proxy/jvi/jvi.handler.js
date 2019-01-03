/**
 *  Not used this js file !!!!!
 *  Not used this js file !!!!!
 *  Not used this js file !!!!!
 */
'use strict';

import ws from '~../server/ws';
import { isEmptyObject } from '~../server/components/utils';

let isWorking = false;

let orderbookMap = {
  USD: {},
  BTC: {},
  KRW: {}
};

let orderbookFeeMap = {
  USD: {},
  BTC: {},
  KRW: {}
};

let mineralMap = {
  USD: {},
  BTC: {},
  KRW: {}
};

const currency = {
  USD: ['binance/BTC', 'coinone/BTC', 'bitfinex/BTC', 'upbit/BTC'],
  BTC: ['binance/BTC', 'coinone/BTC', 'bitfinex/BTC', 'upbit/BTC'],
  KRW: ['bithumb', 'coinbit', 'coinone', 'upbit']
}

const getCurrency = (val) => {
  if (currency.BTC.includes(val)) return 'BTC';
  if (currency.KRW.includes(val)) return 'KRW';
  return 'USD';
}

const clear = () => {
  orderbookMap = { USD: {}, BTC: {}, KRW: {} };
  mineralMap = { USD: {}, BTC: {}, KRW: {} };
}

/**
 * Median
 * @param {*} market 
 * @param {*} coin 
 * @param {*} data 
 */
const organizeData = (market, coin, data) => {
  let currency = getCurrency(market);
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
const addMarket = (type, side, market, order) => {
  if (type[side][market]) {
    type[side][market] = order.amount;
  } else {
    type[side][market] = order.amount;
  }
  return type;
}

const addPrice = (mineral, map, market, data) => {
  for (let order of data) {
    if (map[order.price]) {
      let price = map[order.price];
      if (order.ab === 'a') map[order.price] = addMarket(price, 'ask', market, order);
      else map[order.price] = addMarket(price, 'bid', market, order);
    } else {
      let price = { ask: {}, bid: {} }
      if (order.ab === 'a') map[order.price] = addMarket(price, 'ask', market, order);
      else map[order.price] = addMarket(price, 'bid', market, order);
    }
    if (map[order.price] && !isEmptyObject(map[order.price].ask) && !isEmptyObject(map[order.price].bid)) {
      mineral[order.price] = map[order.price];
    }
  }
  return { mineral: mineral, map: map };
}

/**
 * sort
 * @param {*} market 
 * @param {*} coin 
 * @param {*} data 
 */
const sortData = (market, coin, data) => {
  let currency = getCurrency(market);
  let map = {};
  let mineral = {};
  if (orderbookMap[currency][coin]) {
    map = orderbookMap[currency][coin];
    mineral = mineralMap[currency][coin];
  }
  let res = addPrice(mineral, map, market, data);
  orderbookMap[currency][coin] = res.map;
  mineralMap[currency][coin] = res.mineral;
}

exports.getOrderbook = orderbookMap;
exports.getMineral = mineralMap;
exports.isWorking = isWorking;
exports.clear = clear;

/**
 * handling websocket response data
 */
exports.handler = (msg) => {
  try {
    let ticker = msg.ticker;
    if (ticker) {
      isWorking = true;
      for (let key in ticker) {
        let orderbook = ticker[key]['orderbook'];        
        if (orderbook) { // check orderbook 
          let arr = key.split('-');
          // organizeData(arr[0], arr[1], orderbook);
          sortData(arr[0], arr[1], orderbook);
        }
      }
      // send data      
      ws.broadcast({ type: 'ratio', data: orderbookMap });
      ws.broadcast({ type: 'mineral', data: mineralMap });
    }
  } catch (err) {
    throw err;
  }
};

/**
 * culculating ratio among different coins, markets
 */
exports.getRatio = () => {
  try {
    console.log(orderbookMap);
  } catch (err) {
    throw err;
  }
};
