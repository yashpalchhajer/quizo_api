'use strict';
const { TABLE_QUIZ_TEAM } = require('../config/dbConstant');

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
        model: 'players',
        key: 'id'
      },
      onDelete: 'restrict',
      onUpdate: ' no action'
    },
    quiz_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'quizconfigs',
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

  return QuizTeams;
};