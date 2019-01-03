'use strict';
module.exports = (sequelize, DataTypes) => {
  var signalorder = sequelize.define('signalorder', {
    signalId: DataTypes.INTEGER,
    marketId: DataTypes.STRING,
    marketcoinId: DataTypes.STRING,
    orderId: DataTypes.STRING,
    type: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    fee: DataTypes.DOUBLE,
    amount: DataTypes.DOUBLE
  }, {});
  signalorder.associate = function (models) {
    // associations can be defined here
    signalorder.belongsTo(models.signal, {
      foreignKey: 'signalId'
    })
    signalorder.belongsTo(models.market, {
      foreignKey: 'marketId'
    })
    signalorder.belongsTo(models.marketcoin, {
      foreignKey: 'marketcoinId'
    })
  };
  return signalorder;
};