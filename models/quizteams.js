'use strict';
const { TABLE_QUIZ_TEAM } = require('../config/dbConstant');
const QuizConfigs = require('../models').qa_quiz_configs;
const Players = require('../models').qa_players;
const Sequelize = require('sequelize');

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
    player_status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'TERMINATED'),
      allowNull: false,
      defaultValue: 'ACTIVE'
    },
    quit_time: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true
    },
    questions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    final_score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pushed_questions: {
      type: DataTypes.INTEGER,
      allowNull: false
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

  QuizTeams.getTeamActivePlayersList = (teamId) => {
    return new Promise((resolve, reject) => {
      QuizTeams.findAll({
        where: {
          team_id: teamId,
          player_status: 'ACTIVE'
        }
      })
        .then((playersList) => resolve(playersList))
        .catch(err => reject(err));
    });
  }

  QuizTeams.getPlayerEntry = (id) => {
    return new Promise((resolve, reject) => {
      QuizTeams.findAll({
        raw: true,
        where: {
          'player_id': id,
          'player_status': 'ACTIVE'
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

  QuizTeams.getTeamPlayer = (playerId, teamId) => {
    return new Promise((resolve, reject) => {
      QuizTeams.find({
        raw: true,
        where: {
          team_id: teamId,
          player_id: playerId
        }
      }).then((data) => {
        resolve(data);
      }).catch(err => reject(err));
    });
  }

  QuizTeams.updatePushedQuestionsCount = (playerIds, count, teamId) => {
    return new Promise((resolve, reject) => {
      QuizTeams.update({
        pushed_questions: Sequelize.literal(' pushed_questions + ' + count)
      }, {
          where: {
            team_id: teamId,
            player_id: { [Sequelize.Op.in]: playerIds }
          }
        }).then((data) => {
          resolve(data);
        }).catch(err => reject(err));
    });
  }

  QuizTeams.terminateQuiz = (teamId) => {
    return new Promise((resolve, reject) => {
      QuizTeams.update(
        {
          status: 'TERMINATED'
        },{
          where:{
            team_id: teamId,
            status: 'ACTIVE'
          }
        }
      ).then( (data) => {
        resolve(data);
      }).catch(err => reject(err));
   });
  }

  return QuizTeams;
};