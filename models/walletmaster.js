'use strict';
module.exports = (sequelize, DataTypes) => {
  const WalletMaster = sequelize.define('WalletMaster', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    player_id: {
      type: DataTypes.INTEGER(11),
      allowNull: null,
      references: { model: 'players', key: 'id' }
    },
    type: {
      type: DataTypes.ENUM('ADD', 'REDEEM'),
      allowNull: false,
    },
    coins: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    payment_ref_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: { model: 'paymentmaster', key: 'id' }
    },
    quiz_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: { model: 'quizconfigs', key: 'id' }
    },
    team_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: { model: 'quizteams', key: 'id' }
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
  WalletMaster.associate = function (models) {
    // associations can be defined here
  };
  return WalletMaster;
};