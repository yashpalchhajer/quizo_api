'use strict';
const { TABLE_API_PROVIDERS } = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const ApiProviders = sequelize.define(TABLE_API_PROVIDERS, {
    id: {
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
    icon: {
      type: DataTypes.STRING(255),
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

  ApiProviders.associate = function (models) {
    // associations can be defined here
  };

  ApiProviders.getProviders = function (providerType) {
    return new Promise((resolve, reject) => {
      ApiProviders.findAll({
        raw: true,
        where: {
          type: providerType,
          status: 'ACTIVE'
        },
        attributes: ['id', 'name', 'icon']
      })
        .then((providers) => resolve(providers))
        .catch(err => {
          reject(err)
        });
    })
  };

  ApiProviders.getProviderById = (id) => {
    return new Promise((resolve, reject) => {
      ApiProviders.findOne(
        {
          raw: true,
          where: { id: id, status: 'ACTIVE' }
        },

      )
      .then(provider => { resolve(provider) })
      .catch(err => {
        reject(err)
      });
    });
  };

  return ApiProviders;
};