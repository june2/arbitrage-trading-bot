'use strict';
module.exports = (sequelize, DataTypes) => {
  var coin = sequelize.define('coin', {    
    target: DataTypes.DOUBLE,
    min: DataTypes.DOUBLE,
    max: DataTypes.DOUBLE
  }, {});
  coin.associate = function (models) {
    // associations can be defined here    
    coin.hasMany(models.marketcoin);    
  };
  return coin;
};