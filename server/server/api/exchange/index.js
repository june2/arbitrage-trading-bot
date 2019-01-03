'use strict';

import Router from 'koa-router';
import exchangeCtrl from './exchange.ctrl';

const api = new Router(); // 라우터 분리

api.get('/balances', exchangeCtrl.getBalances); 

export default api;
