'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('signals', [{
      marketcoinId: 'KRW-BTC',
      time: new Date(),
      balances: JSON.stringify({ upbit: { coin: 100, krw: 99999 } }),
      target: 5,
      min: 20,
      max: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      orderbook: JSON.stringify({}),
    },{
      marketcoinId: 'KRW-BTC',
      time: new Date(),
      balances: JSON.stringify({ upbit: { coin: 100, krw: 99999 } }),
      target: 15,
      min: 120,
      max: 1100,
      createdAt: new Date(),
      updatedAt: new Date(),
      orderbook: JSON.stringify({}),
    },{
      marketcoinId: 'KRW-BTC',
      time: new Date(),
      balances: JSON.stringify({ upbit: { coin: 100, krw: 99999 } }),
      target: 5,
      min: 20,
      max: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      orderbook: JSON.stringify({}),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
