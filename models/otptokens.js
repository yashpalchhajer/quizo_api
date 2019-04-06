'use strict';
const { TABLE_OTP_TOKENS } =  require('../config/dbConstant');


module.exports = (sequelize, DataTypes) => {
  const OTPTokens = sequelize.define(TABLE_OTP_TOKENS, {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    action: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    retry_available: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    valid_uptp: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {});
  OTPTokens.associate = function (models) {
    OTPTokens.belongsTo(models.qa_players, {
      through: 'players',
      as: 'player',
      foreignKey: 'player_id'
    });
  };
  return OTPTokens;
};