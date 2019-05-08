'use strict';
const {TABLE_PLAYER_QUESTIOS} = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const PlayerQuestions = sequelize.define(TABLE_PLAYER_QUESTIOS, {
    player_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    questions_id:{
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null
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
  PlayerQuestions.associate = function(models) {
    // associations can be defined here
  };
  return PlayerQuestions;
};