'use strict';

import Jvi from '~../server/proxy/jvi';
import Coin from '~../server/components/coin';
import models from '~../db/models';
import service from './jtm.service';
import { Op } from 'sequelize';

export default {
  start: async (ctx, next) => {
    try {
      Jvi.init();
      return ctx.res.ok({ data: 'jtm is started' });
    } catch (e) {
      ctx.throw(500, e);
    }
  },
  stop: async (ctx, next) => {
    try {
      Jvi.stop();
      return ctx.res.ok({ data: 'jtm was stoped' });
    } catch (e) {
      ctx.throw(500, e);
    }
  },
  getMarkets: async (ctx, next) => {
    try {
      let market = await models.market.findAll({})
      return ctx.res.ok({ data: market });
    } catch (e) {
      ctx.throw(500, e);
    }
  },
  getCoins: async (ctx, next) => {
    try {
      let currency = ctx.query.currency;
      return ctx.res.ok({ data: await service.getCoins(currency) });
    } catch (e) {
      ctx.throw(500, e);
    }
  },
  getMarketcoins: async (ctx, next) => {
    try {
      let marketcoin = await models.marketcoin.findAll({})
      return ctx.res.ok({ data: marketcoin });
    } catch (e) {
      ctx.throw(500, e);
    }
  },
  getActivecoins: (ctx, next) => {
    try {
      return ctx.res.ok({ data: Coin.activeCoin });
    } catch (e) {
      ctx.throw(500, e);
    }
  },
  updateMarketcoins: async (ctx, next) => {
    try {
      let body = ctx.request.body;
      for (let coin of body) {
        // 코인 정보 업데이트
        await models.coin.update({ min: coin.min, max: coin.max, target: coin.target }, { where: { id: coin.id } });
        for (let data of coin.marketcoins) {
          // 거래소 코인 정보 업데이트
          await models.marketcoin.update({ enabled: data.enabled }, { where: { id: data.id } });
        }
      }
      Coin.setActiveCoin();
      Jvi.clear();
      return ctx.res.ok();
    } catch (e) {
      ctx.throw(500, e);
    }
  },
  getOrderbook: async (ctx, next) => {
    try {
      return ctx.res.ok({ data: Jvi.getOrderbook() });
    } catch (e) {
      ctx.throw(500, e);
    }
  },
  getMineral: async (ctx, next) => {
    try {
      return ctx.res.ok({ data: Jvi.getMineral() });
    } catch (e) {
      ctx.throw(500, e);
    }
  },
  saveSignal: async (ctx, next) => {
    try {
      return ctx.res.ok({ data: '' });
    } catch (e) {
      ctx.throw(500, e);
    }
  },
  getSignals: async (ctx, next) => {
    try {
      let currency = ctx.query.currency;
      let coinId = ctx.query.coinId;      
      return ctx.res.ok({ data: await service.getSignals(currency, coinId) });
    } catch (e) {
      ctx.throw(500, e);
    }
  }
}
