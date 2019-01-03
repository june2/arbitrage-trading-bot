'use strict';
module.exports = (sequelize, DataTypes) => {
  var market = sequelize.define('market', {
    currency: DataTypes.STRING
  }, {});
  market.associate = function (models) {
    market.hasMany(models.marketcoin);
    market.hasMany(models.signalorder);
  };
  return market;
};