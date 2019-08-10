'use strict';
module.exports = (sequelize, DataTypes) => {
  const Wallets = sequelize.define('Wallets', {
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
      references: {model:'players',key:'id'}
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
  return Wallets;
};