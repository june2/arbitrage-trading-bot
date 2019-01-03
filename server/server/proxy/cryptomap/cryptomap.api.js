'use strict';

import axios from 'axios';
import models from '~../db/models';
import { apiUrl } from './config.json';

exports.getInfo = async () => {
  try {
    let res = await axios.get(`${apiUrl}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

exports.getMarketInfo = async () => {
  try {
    let res = await axios.get(`${apiUrl}/markets/info`);
    if (res.data) {
      for (let data of res.data) {
        await models.market.findOrCreate({
          where: { id: data.market.id, currency: data.market.currency }
        });
        for (let coin of data.precisions) {
          await models.coin.findOrCreate({
            where: {
              id: coin.symbol,
              min: 0, 
              max: 0,
            }
          })
          await models.marketcoin.findOrCreate({
            where: {
              id: `${data.market.id}-${coin.symbol}`,
              coinId: coin.symbol,
              marketId: data.market.id,
              maker: coin.feeMaker,
              taker: coin.feeTaker,
              min: 0, 
              max: 0,
            }
          })
        }
      } // end market
    }
    return res.data;
  } catch (err) {
    throw err;
  }
};