'use strict';
module.exports = (sequelize, DataTypes) => {
  var marketcoin = sequelize.define('marketcoin', {
    coinId: DataTypes.STRING,
    marketId: DataTypes.STRING,
    min: DataTypes.DOUBLE,
    max: DataTypes.DOUBLE,
    maker: DataTypes.DOUBLE,
    taker: DataTypes.DOUBLE,
    enabled: DataTypes.BOOLEAN    
  }, {});
  marketcoin.associate = function(models) {
    // associations can be defined here
    marketcoin.belongsTo(models.coin, {
      foreignKey: 'coinId'
    })
    marketcoin.belongsTo(models.market, {
      foreignKey: 'marketId'
    })
  };
  return marketcoin;
};