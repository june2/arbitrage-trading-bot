'use strict';
module.exports = (sequelize, DataTypes) => {
  var signal = sequelize.define('signal', {
    coinId: DataTypes.STRING,
    currency: DataTypes.STRING,
    time: DataTypes.DATE,
    balances: {
      type: DataTypes.TEXT,
      get: function () {
        return JSON.parse(this.getDataValue('balances'));
      },
      set: function (value) {
        this.setDataValue('balances', JSON.stringify(value));
      },
    },
    target: DataTypes.DOUBLE,
    min: DataTypes.DOUBLE,
    max: DataTypes.DOUBLE,
    orderbook: {
      type: DataTypes.TEXT,
      get: function () {
        return JSON.parse(this.getDataValue('orderbook'));
      },
      set: function (value) {
        this.setDataValue('orderbook', JSON.stringify(value));
      },
    },
  }, {});
  signal.associate = function (models) {
    signal.hasMany(models.signalorder)
    signal.belongsTo(models.coin, {
      foreignKey: 'coinId'
    })
  };
  return signal;
};