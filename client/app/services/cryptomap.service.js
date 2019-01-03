import axios from 'axios';
import api from './api';
import { Db } from '../../app/database';

class CryptomapService {
  constructor() {
    this._api = api('cryptomap');
  }

  async getVersion() {
    return await this._api.get('');
  }

  async getInfo() {
    let currencies = await Db.currencies.find();
    let coins = await Db.coins.find();
    if (currencies && currencies.length > 0) return { currencies: currencies, coins: coins };
    else {
      let res = await this._api.get('/info');
      let map = {};
      res.map(obj => {
        if (!map[obj.market.currency]) {
          map[obj.market.currency] = [obj.market.id];
        } else {
          map[obj.market.currency].push(obj.market.id);
        }
        obj.precisions.map(async (val) => {
          if (val.available && val.enabled) {
            let id = val.coin.id;
            let coin = await Db.coins.find({ _id: id });
            if (coin.length === 0) return await Db.coins.insert({ _id: id });
          }
        })
      });
      Object.keys(map).map(key => {
        return Db.currencies.insert({ _id: key, data: map[key] })
      });
      return { currencies: await Db.currencies.find(), coins: await Db.coins.find() };
    }
  }
}

export default new CryptomapService();