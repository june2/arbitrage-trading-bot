'use strict';

import api from './cryptomap.api';

const cryptomap = {
  getInfo: () => api.getInfo(),
  getMarketInfo: () => api.getMarketInfo()
};

export default cryptomap;