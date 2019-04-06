'use strict';
const {TABLE_MERCHANT_MASTER} = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const MerchantMaster = sequelize.define(TABLE_MERCHANT_MASTER, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contact_number: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    api_key: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'TERMINATE'),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {});

  MerchantMaster.associate = function (models) {
    MerchantMaster.belongsToMany(models.qa_players, {
      through: 'merchants',
      as: 'player',
      foreignKey: 'id'
    });
  };
  return MerchantMaster;
};