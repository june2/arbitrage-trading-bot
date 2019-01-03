'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('signalorders', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      signalId: {
        allowNull: false,
        type: Sequelize.INTEGER   
      },
      marketId: {
        allowNull: false,
        type: Sequelize.STRING   
      },
      marketcoinId: {
        allowNull: true,
        type: Sequelize.STRING   
      },
      orderId: {
        allowNull: true,
        type: Sequelize.STRING   
      },
      type: {
        type: Sequelize.STRING
      },
      price: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      fee: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      amount: {
        allowNull: true,
        type: Sequelize.DOUBLE
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
    return queryInterface.dropTable('signalorders');
  }
};