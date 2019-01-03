'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('signals', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      coinId: {
        allowNull: true,
        type: Sequelize.STRING
      },
      currency: {
        allowNull: true,
        type: Sequelize.STRING
      },
      time: {
        allowNull: true,
        type: Sequelize.DATE
      },
      balances: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      target: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      min: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      max: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      orderbook: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('signals');
  }
};