'use strict';

import cryptomap from '~/server/proxy/cryptomap';

export default {
  getInfo: async (ctx, next) => {
    try {
      return ctx.res.ok({ data: await cryptomap.getInfo() });
    } catch (e) {
      ctx.throw(500, e);
    }
  },
  getMarketInfo: async (ctx, next) => {
    try {
      return ctx.res.ok({ data: await cryptomap.getMarketInfo() });
    } catch (e) {
      ctx.throw(500, e);
    }
  }
}