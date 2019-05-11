'use strict';
const { TABLE_QUIZ_TEAM } = require('../config/dbConstant');
const QuizConfigs = require('../models').qa_quiz_configs;
const Players = require('../models').qa_players;
module.exports = (sequelize, DataTypes) => {
  const QuizTeams = sequelize.define(TABLE_QUIZ_TEAM, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      // autoIncrement: true
    },
    team_id: {
      allowNull: false,
      type: DataTypes.STRING
    },
    player_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: Players,
        key: 'id'
      },
      onDelete: 'restrict',
      onUpdate: ' no action'
    },
    quiz_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: QuizConfigs,
        key: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'no action'
    },
    questions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    final_score: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});

  QuizTeams.associate = function (models) {
    // associations can be defined here
  };

  QuizTeams.registerNewTeam = (reqData) => {
    return new Promise((resolve, reject) => {
      QuizTeams.bulkCreate(reqData)
        .then((player) => {
          resolve(player);
        }).catch(err => reject(err));
    });
  }

  QuizTeams.getPlayerEntry = (id) => {
    return new Promise((resolve, reject) => {
      QuizTeams.findAll({
        raw: true,
        where: {
          'player_id': id
        },
        order: [['createdAt', 'DESC']],
        limit: 1
      }).then((data) => {
        resolve(data);
      }).catch(err => reject(err));
    });
  }


  QuizTeams.getAllPlayersIds = (teamId) => {
    return new Promise((resolve, reject) => {
      QuizTeams.findAll({
        raw: true,
        where: {
          team_id: teamId
        },
        attributes: ['player_id']
      }).then((data) => {
        resolve(data);
      }).catch(err => reject(err));
    });
  }

  return QuizTeams;
};