'use strict';
const { TABLE_PLAYER_QUESTIOS } = require('../config/dbConstant');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const PlayerQuestions = sequelize.define(TABLE_PLAYER_QUESTIOS, {
    player_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    questions_id: {
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
  PlayerQuestions.associate = function (models) {
    // associations can be defined here
  };

  PlayerQuestions.fetchPlayersQuestions = (playerIds) => {
    return new Promise((resolve, reject) => {
      PlayerQuestions.findAll({
        raw : true,
        where: {
          player_id: { [Sequelize.Op.in]: playerIds }
        },
        attributes : { exclude: ['createdAt','updatedAt'] }
      })
        .then((playersList) => resolve(playersList))
        .catch(err => reject(err));
    });
  }

  PlayerQuestions.insertPlayersQuestion = (playerIds) => {
    return new Promise((resolve, reject) => {
      PlayerQuestions.bulkCreate(playerIds, {
        updateOnDuplicate: ["player_id","questions_id"]
      }).then((player) => {
        resolve(player);
      }).catch(err => reject(err));
    });
  }

  PlayerQuestions.updatePlayerQuestions = (questions, playerId) => {
    return new Promise((resolve, reject) => {
      PlayerQuestions.update({
        questions_id: questions
      }, {
          where: {
            player_id: playerId
          }
        }).then(updateCount => {
          if (updateCount[0] != 1)
            throw new CustomError("Players questions are not updated");
          resolve(updateCount);
        }).catch(err => {
          reject(err);
        });
    });
  }
  return PlayerQuestions;
};