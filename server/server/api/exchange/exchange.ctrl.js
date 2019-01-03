'use strict';

import Binance from '~../server/proxy/exchanges/binance';
import Bithumb from '~../server/proxy/exchanges/bithumb';
import Coinone from '~../server/proxy/exchanges/coinone';
import Upbit from '~../server/proxy/exchanges/upbit';

export default {
  getBalances: async (ctx, next) => {
    try {
      let coin = ctx.query.coin || 'BTC';
      let currency = ctx.query.currency || 'KRW';
      let data = { updateTime: new Date(), balances: {} };
      switch (currency) {
        case 'KRW':
          data.balances.bithumb = await Bithumb.getAccount(coin);
          data.balances.coinone = await Coinone.getAccount(coin);
          data.balances.upbit = await Upbit.getAccount(coin);
          break;
      }
      return ctx.res.ok({ data: data });
    } catch (e) {
      ctx.throw(500, e);
    }
  }
}