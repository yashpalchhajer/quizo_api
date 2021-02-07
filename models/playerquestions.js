'use strict';
const { TABLE_PLAYER_QUESTIOS } = require('../config/dbConstant');
const Sequelize = require('sequelize');
const messages = require('../config/ErrorCode');

module.exports = (sequelize, DataTypes) => {
  const PlayerQuestions = sequelize.define(TABLE_PLAYER_QUESTIOS, {
    player_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      rimaryKey: true,
      allowNull: false
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

  PlayerQuestions.fetchPlayersQuestions = (playerIds, quizId) => {
    return new Promise((resolve, reject) => {
      PlayerQuestions.findAll({
        raw : true,
        where: {
          quiz_id: quizId,
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
            throw new CustomError(messages.PLAYER_QUESTIONS_NOT_UPDATED_MESSAGE, PLAYER_QUESTIONS_NOT_UPDATED_CODE);
          resolve(updateCount);
        }).catch(err => {
          reject(err);
        });
    });
  }
  return PlayerQuestions;
};