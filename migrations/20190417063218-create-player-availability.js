'use strict';

const { TABLE_PLAYER_AVAILABLE } = require('../config/dbConstant');
const { TABLE_PLAYERS } = require('../config/dbConstant');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_PLAYER_AVAILABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      player_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      is_free: {
        type: Sequelize.ENUM('TRUE', 'FALSE'),
        defaultValue: 'TRUE',
      },
      quiz_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      team_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        allowNull:true
      }
    }).then(() => queryInterface.addConstraint(TABLE_PLAYER_AVAILABLE, ['player_id'], {
      type: 'FOREIGN KEY',
      name: 'player_id',
      references: {
        table: TABLE_PLAYERS,
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'no action'
    }));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_PLAYER_AVAILABLE);
  }
};