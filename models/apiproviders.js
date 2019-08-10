'use strict';
module.exports = (sequelize, DataTypes) => {
  const ApiProviders = sequelize.define('ApiProviders', {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    contact_number: {
      allowNull: false,
      type: DataTypes.STRING(20),
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'TERMINATED'),
      allowNull: false,
      defaultValue: 'INACTIVE'
    },
    credentials: {
      type: DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_unicode_ci',
      defaultValue: '',
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {});
  
  ApiProviders.associate = function(models) {
    // associations can be defined here
  };



  
  return ApiProviders;
};