'use strict';

const dbConstant = require('../config/dbConstant');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(dbConstant.TABLE_API_PROVIDERS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      contact_number: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      icon:{
        type: Sequelize.STRING(255),
        allowNull: true
      },
      type: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'TERMINATED'),
        allowNull: false,
        defaultValue: 'INACTIVE'
      },
      credentials: {
        type: Sequelize.TEXT + ' CHARSET utf8 COLLATE utf8_unicode_ci',
        allowNull: false
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
    return queryInterface.dropTable(dbConstant.TABLE_API_PROVIDERS);
  }
};