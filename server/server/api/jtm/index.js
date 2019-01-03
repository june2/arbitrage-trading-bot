'use strict';

import Router from 'koa-router';
import jtmCtrl from './jtm.ctrl';

const api = new Router(); // 라우터 분리

api.get('/start', jtmCtrl.start); 
api.get('/stop', jtmCtrl.stop); 
api.get('/markets', jtmCtrl.getMarkets); 
api.get('/coins', jtmCtrl.getCoins); 
api.get('/activecoins', jtmCtrl.getActivecoins); 
api.get('/marketcoins', jtmCtrl.getMarketcoins);
api.put('/marketcoins', jtmCtrl.updateMarketcoins);
api.get('/orderbook', jtmCtrl.getOrderbook); 
api.get('/mineral', jtmCtrl.getMineral); 
api.get('/signals', jtmCtrl.getSignals); 

export default api;
