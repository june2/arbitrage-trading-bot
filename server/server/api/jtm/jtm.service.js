'use strict';

import models from '~../db/models';
import { Op } from 'sequelize';

export default {
  getCoins: async (currency) => {
    try {
      let query = {};
      if (currency) {
        let array = [];
        let markets = await models.market.findAll({
          attributes: ['id'],
          where: { currency: currency }
        });
        for (let market of markets) { array.push(market.id); }
        query = {
          marketId: { [Op.in]: array }
        };
      }
      return await models.coin.findAll({
        include: [{
          model: models.marketcoin,
          where: query
        }],
        order: ['id']
      })
    } catch (err) {
      throw err;
    }
  },
  saveSignal: async (currency, coinId, target, min, max, orderbook, order) => {
    try {
      let signal = await models.signal.create({
        time: new Date(),
        currency: currency,
        coinId: coinId, target: target, min: min, max: max, orderbook: orderbook
      });
      models.signalorder.create({
        signalId: signal.id,
        orderId: order.buyId || '',
        marketId: order.buy,
        type: 'ask',
        price: order.buyPrice,
        fee: order.buyFee,
        amount: order.amount
      });
      models.signalorder.create({
        signalId: signal.id,
        orderId: order.sellId || '',
        marketId: order.sell,
        type: 'bid',
        price: Number(order.sellPrice),
        fee: Number(order.sellFee),
        amount: order.amount
      });
    } catch (err) {
      throw err;
    }
  },
  getSignals: async (currency, coinId) => {
    try {      
      return await models.signal.findAll({
        where: { currency: currency, coinId: coinId },         
        include: [{
          model: models.signalorder,
        }],
        order: ['time']
      })
    } catch (err) {
      throw err;
    }
  }
}
