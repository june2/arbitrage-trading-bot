'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('marketcoins', {
      id: {
        allowNull: false,        
        primaryKey: true,
        type: Sequelize.STRING
      },
      marketId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      coinId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      min: {
        allowNull: true,
        defaultValue: 0,
        type: Sequelize.DOUBLE
      },
      max: {
        allowNull: true,
        defaultValue: 0,
        type: Sequelize.DOUBLE
      },
      maker: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      taker: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      enabled: {
        allowNull: true,
        defaultValue: false,
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('marketcoins');
  }
};