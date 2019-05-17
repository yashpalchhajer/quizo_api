'use strict';
const {TABLE_PLAYER_QUESTIOS} = require('../config/dbConstant');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_PLAYER_QUESTIOS, {
      player_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      quiz_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      questions_id:{
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_PLAYER_QUESTIOS);
  }
};