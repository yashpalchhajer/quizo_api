'use strict';
const { TABLE_QUIZ_TEAM } = require('../config/dbConstant');
const { TABLE_PLAYERS } = require('../config/dbConstant');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_QUIZ_TEAM, {
      id: {
        allowNull: false,
        // autoIncrement: true,
        // primaryKey: true,
        type: Sequelize.INTEGER
      },
      team_id: {
        allowNull: false,
        type: Sequelize.STRING
      },
      player_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      quiz_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      questions: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      final_score: {
        type: Sequelize.INTEGER(11),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        allowNull: true
      }
    }).then(() => queryInterface.addConstraint(TABLE_QUIZ_TEAM, ['player_id'], { // colom name of the same table
      type: 'FOREIGN KEY',
      name: 'player_ref', // constrain name
      references: {
        table: TABLE_PLAYERS, // ref table name
        field: 'id' // colom of ref table
      },
      onDelete: 'restrict',
      onUpdate: 'no action'
    }));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_QUIZ_TEAM);
  }
};