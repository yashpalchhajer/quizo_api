'use strict';

const dbConstant = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const PaymentMaster = sequelize.define(dbConstant.TABLE_PAYMENT_MASTERS, {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    transaction_number: {
      allowNull: false,
      type: DataTypes.STRING(20),
    },
    player_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: { model: 'players', key: 'id' }
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    plan_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    provider_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: { model: 'apiproviders', key: 'id' }
    },
    transaction_type: {
      type: DataTypes.ENUM('ADD', 'REDEEM'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('INITIATED', 'HOLD', 'SUCCESS', 'FAILED', 'REFUND'),
      allowNull: false
    },
    provider_message: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ''
    },
    provider_transaction_number: {
      type: DataTypes.STRING(50),
      defaultValue: ''
    },
    ref1_no: {
      type: DataTypes.INTEGER(11),
      defaultValue: null
    },
    reference_number: {
      type: DataTypes.STRING(50),
      defaultValue: ''
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
  PaymentMaster.associate = function (models) {
    // associations can be defined here
  };
  return PaymentMaster;
};