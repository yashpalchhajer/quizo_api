'use strict';
const dbConstant = require('../config/dbConstant');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(dbConstant.TABLE_WALLET_MASTERS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      player_id: {
        type: Sequelize.INTEGER(11),
        allowNull: null,
      },
      type: {
        type: Sequelize.ENUM('ADD', 'REDEEM'),
        allowNull: false,
      },
      coins: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      payment_ref_id: {
        type: Sequelize.INTEGER(11),
        allowNull: true
      },
      quiz_id: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
      },
      team_id: {
        type: Sequelize.INTEGER(11),
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }).then(() => {
      [
        queryInterface.addConstraint(dbConstant.TABLE_WALLET_MASTERS, ['payment_ref_id'], {
          type: 'FOREIGN KEY',
          name: 'payment id',
          references: {
            table: dbConstant.TABLE_PAYMENT_MASTERS,
            field: 'id'
          },
          onDelete: 'restrict',
          onUpdate: 'no action'
        }),
        queryInterface.addConstraint(dbConstant.TABLE_WALLET_MASTERS, ['quiz_id'], {
          type: 'FOREIGN KEY',
          name: 'quiz',
          references: {
            table: dbConstant.TABLE_QUIZ_CONFIG,
            field: 'id'
          }
        }),
        queryInterface.addConstraint(dbConstant.TABLE_WALLET_MASTERS, ['team_id'], {
          type: 'FOREIGN KEY',
          name: 'team',
          references: {
            table: dbConstant.TABLE_QUIZ_TEAM,
            field: 'id'
          }
        }),
        queryInterface.addConstraint(dbConstant.TABLE_WALLET_MASTERS, ['player_id'], {
          type: 'FOREIGN KEY',
          name: 'players',
          references: {
            table: dbConstant.TABLE_PLAYERS,
            field: 'id'
          },
          onDelete: 'restrict',
          onUpdate: 'no action'
        })
      ]
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(dbConstant.TABLE_WALLET_MASTERS);
  }
};