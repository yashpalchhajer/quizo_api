'use strict';
const {TABLE_PLAYERS} = require('../config/dbConstant');
const {TABLE_OTP_TOKENS} = require('../config/dbConstant');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_OTP_TOKENS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      player_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      otp:{
        type:Sequelize.STRING(8),
        allowNull:false
      },
      action: {
        type: Sequelize.TINYINT,
        allowNull: false,
      },
      retry_available: {
        type: Sequelize.TINYINT,
        allowNull: false
      },
      is_valid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      valid_upto: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    })
    .then(() => queryInterface.addConstraint(TABLE_OTP_TOKENS,['player_id'],{
      type: 'FOREIGN KEY',
      name: 'player_otp',
      references:{
        table: TABLE_PLAYERS,
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate:'no action'
    }));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_OTP_TOKENS);
  }
};