'use strict';

const dbConstant = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const Wallets = sequelize.define(dbConstant.TABLE_WALLETS, {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    player_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      unique: true,
      references: { model: 'players', key: 'id' }
    },
    free_credits: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    referrals: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    purchased: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    earned: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
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
  Wallets.associate = function (models) {
    // associations can be defined here
  };

  Wallets.getWalletDetails = (player) => {
    return new Promise((resolve, reject) => {
      Wallets.findOne({
        where: {
          player_id: player.id
        }
      }).then(wallet => {
        resolve(wallet)
      }).catch(err => reject(err));
    });
  };

  Wallets.createWallet = (player) => {
    return new Promise((resolver, reject) => {
      Wallets.findOrCreate({
        where: { player_id: player.id },
        defaults: {
          free_credits: process.env.WALLET_FREE_COINS
        }
      }).then(wallet => {
        resolver(wallet);
      }).catch(err => reject(err));
    })
  };

  return Wallets;
};