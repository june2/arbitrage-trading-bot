import models from '~../db/models';

let instance = null;

const Coin = class {
  constructor() {
    if (!instance) { instance = this; }
    this._activeCoin = new Map();
    this._info = new Map();
    return instance;
  }
  get activeCoin() {
    return this._activeCoin;
  }
  get info() {
    return this._info;
  }
  async setActiveCoin() {
    this._activeCoin.clear();
    this._info.clear();
    let marketcoins = await models.marketcoin.findAll({
      where: { enabled: true },
    })
    for (let marketcoin of marketcoins) {
      if (!this._info.has(marketcoin.coinId)) {
        let coin = await models.coin.findById(marketcoin.coinId);
        this._info.set(marketcoin.coinId, coin);
      }
      this._activeCoin.set(marketcoin.id, marketcoin);
    }
  }
}

module.exports = new Coin();