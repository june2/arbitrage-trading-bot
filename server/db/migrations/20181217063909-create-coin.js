'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('coins', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      target: {
        allowNull: true,
        defaultValue: 0,
        type: Sequelize.DOUBLE
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
    return queryInterface.dropTable('coins');
  }
};