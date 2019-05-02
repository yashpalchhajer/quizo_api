'use strict';
const { TABLE_PLAYER_AVAILABLE } = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const PlayerAvailable = sequelize.define(TABLE_PLAYER_AVAILABLE, {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    player_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: { model: 'players', key: 'id' }
    },
    is_free: {
      type: DataTypes.ENUM('true', 'FALSE'),
      defaultValue: true,
    },
    quiz_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: { model: 'quizconfigs', key: 'id' }
    },
    team_id: {
      type: DataTypes.STRING,
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
      type: DataTypes.DATE
    }
  }, {});

  PlayerAvailable.associate = function (models) {
    PlayerAvailable.belongsTo(models.qa_players, {
      through: 'players',
      as: 'player',
      foreignKey: 'player_id'
    });

    /*     PlayerAvailable.belongsTo(models.qa_quiz_configs, {
          through: 'quizid',
          as: 'quiz',
          foreignKey: 'quz_id'
        });
    
        PlayerAvailable.belongsTo(models.qa_quiz_teams, {
          through: 'teamid',
          as: 'team',
          foreignKey: 'team_id'
        }); */



    // associations can be defined here
  };

  PlayerAvailable.checkExistance = (player) => {
    return new Promise((resolve, reject) => {
      PlayerAvailable.findOne(
        {
          where: {
            player_id: player.id,
            is_free: true,
            team_id: null
          }
        }
      ).then(player => {
        resolve(player);
      }).catch(err => {
        reject(err);
      });
    });

  };

  PlayerAvailable.fetchFreePlayersQuizWise = (quizId) => {
    return new Promise((resolve, reject) => {
      PlayerAvailable.findAndCountAll(
        {
          where: {
            quiz_id: quizId,
            is_free: true,
            team_id: null
          }
        }
      ).then(playerAvailable => {
        resolve(playerAvailable);
      }).catch(err => {
        reject(err);
      });
    });
  };

  PlayerAvailable.updatePlayersToBusy = (playerData) => {
    return new Promise((resolve, reject) => {
      // PlayerAvailable.bulkUpdate(TABLE_PLAYER_AVAILABLE, { is_free: "FALSE" }, playerData)
      //   .then(playerAvailable => {
      //     resolve(playerAvailable);
      //   }).catch(err => {
      //     reject(err);
      //   });
    });
  };

  PlayerAvailable.registerPlayerRequest = (playerId, quizId) => {
    return new Promise((resolve, reject) => {
      PlayerAvailable.findOne({
        where: {
         player_id: playerId,
          is_free: true,
          team_id: null,
          quiz_id: quizId
        }
      })
        .then(playerAvailable => {

          if (!playerAvailable) {
            PlayerAvailable.create({
              player_id: playerId,
              is_free: true,
              quiz_id: quizId
            }).then(available => {
              resolve(available);
            }).catch(err => { console.log(err); reject(err) });

          } else {
            resolve(playerAvailable);
          }

        }).catch(err => {
          console.log(err);
          reject(err);
        });
    });
  };

  return PlayerAvailable;
};