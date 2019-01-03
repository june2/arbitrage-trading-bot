'use strict';

import Router from 'koa-router';
import cryptomapCtrl from './cryptomap.ctrl';

const api = new Router(); // 라우터 분리

api.get('/', cryptomapCtrl.getInfo); // 크립토맵 버전 정보
api.get('/info', cryptomapCtrl.getMarketInfo); // 크립토맵 맵핑 정보

export default api;
