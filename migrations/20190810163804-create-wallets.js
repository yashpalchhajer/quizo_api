'use strict';

const dbConstant = require('../config/dbConstant');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(dbConstant.TABLE_WALLETS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      player_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        // unique: true
      },
      free_credits: {
        type: Sequelize.DOUBLE,
        defaultValue: 0
      },
      referrals: {
        type: Sequelize.DOUBLE,
        defaultValue: 0
      },
      purchased: {
        type: Sequelize.DOUBLE,
        defaultValue: 0
      },
      earned: {
        type: Sequelize.DOUBLE,
        defaultValue: 0
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
    }).then(() => queryInterface.addConstraint(dbConstant.TABLE_WALLETS, ['player_id'], {
      type: 'FOREIGN KEY',
      name: 'players id',
      references: {
        table: dbConstant.TABLE_PLAYERS,
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'no action'
    }));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(dbConstant.TABLE_WALLETS);
  }
};