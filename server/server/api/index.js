'use strict';

import Router from 'koa-router';
import cryptomap from './cryptomap';
import jtm from './jtm';
import exchange from './exchange';
import pkginfo from '~.package.json';

// 라우터 분리
const api = new Router();

let getApiInfo = ctx => {
  const data = {
    name: pkginfo.name,
    version: pkginfo.version,
    description: pkginfo.description,
    author: pkginfo.author
  };
  return ctx.res.ok({ data: data });
};

api.get('/', getApiInfo);
api.use('/cryptomap', cryptomap.routes()); // cryptomap router
api.use('/jtm', jtm.routes()); // jtm router
api.use('/exchanges', exchange.routes()); // jtm router

export default api;