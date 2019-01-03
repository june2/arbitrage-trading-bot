'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('signalorders', [{
      signalId: 1,
      marketId: 'coinone',
      amount: 4,
      price: 10004,
      type: 'a',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      signalId: 1,
      marketId: 'upbit',
      amount: 4,
      price: 10002,
      type: 'b',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      signalId: 2,
      marketId: 'upbit',
      amount: 4,
      price: 10002,
      type: 'a',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      signalId: 2,
      marketId: 'coinone',
      amount: 4,
      price: 1000,
      type: 'b',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      signalId: 3,
      marketId: 'upbit',
      amount: 28,
      price: 100022,
      type: 'a',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      signalId: 3,
      marketId: 'coinone',
      amount: 14,
      price: 100023,
      type: 'b',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      signalId: 3,
      marketId: 'bithumb',
      amount: 14,
      price: 10002,
      type: 'b',
      createdAt: new Date(),
      updatedAt: new Date(),
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
