'use strict';
const {TABLE_USER_MASTER} = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const UserMaster = sequelize.define(TABLE_USER_MASTER, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    password:{
      type: DataTypes.STRING(50),
      allowNull:false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {});

  return UserMaster;
};