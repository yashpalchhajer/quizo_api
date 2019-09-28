'use strict';
const dbConstant = require('../config/dbConstant');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(dbConstant.TABLE_PAYMENT_MASTERS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaction_number: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      player_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0
      },
      plan_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'Plan that is created in mongo'
      },
      provider_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      transaction_type: {
        type: Sequelize.ENUM('ADD', 'REDEEM'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('INITIATED', 'HOLD', 'SUCCESS', 'FAILED', 'REFUND'),
        allowNull: false
      },
      provider_message: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: ''
      },
      provider_transaction_number: {
        type: Sequelize.STRING(50),
        defaultValue: ''
      },
      ref1_no: {
        type: Sequelize.INTEGER(11),
        defaultValue: null
      },
      reference_number_1: {
        type: Sequelize.STRING(50),
        defaultValue: '',
        allowNull:true
      },
      reference_number_2: {
        type: Sequelize.STRING(255),
        defaultValue: '',
        allowNull:true
      },
      reference_number_3: {
        type: Sequelize.STRING(255),
        defaultValue: '',
        allowNull:true
      },
      reference_number_4: {
        type: Sequelize.TEXT,
        defaultValue: '',
        allowNull:true
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
        queryInterface.addConstraint(dbConstant.TABLE_PAYMENT_MASTERS, ['provider_id'], {
          type: 'FOREIGN KEY',
          name: 'provider',
          references: {
            table: dbConstant.TABLE_API_PROVIDERS,
            field: 'id'
          },
          onDelete: 'restrict',
          onUpdate: 'no action'
        }),
        queryInterface.addConstraint(dbConstant.TABLE_PAYMENT_MASTERS, ['player_id'], {
          type: 'FOREIGN KEY',
          name: 'player',
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
    return queryInterface.dropTable(dbConstant.TABLE_PAYMENT_MASTERS);
  }
};