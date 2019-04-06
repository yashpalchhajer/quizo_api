'use strict';
const {TABLE_PLAYERS} = require('../config/dbConstant');


module.exports = (sequelize, DataTypes) => {
  const Players = sequelize.define(TABLE_PLAYERS, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    merchant_id:{
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {model:'merchantmaster',key:'id'}
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contact_number: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    gender:{
      type: DataTypes.ENUM('M','F','T'),
      allowNull:true
    },
    profile_img_url:{
      type: DataTypes.TEXT,
      allowNull:true
    },
    status:{
      type: DataTypes.ENUM('ACTIVE','INACTIVE','TERMINATE'),
      allowNull:false,
      defaultValue:'ACTIVE'
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  Players.associate = function(models) {
    Players.belongsTo(models.qa_merchant_masters, {
      through: 'merchants',
      as: 'player',
      foreignKey: 'merchant_id'
    });
    // associations can be defined here
  };
  return Players;
};