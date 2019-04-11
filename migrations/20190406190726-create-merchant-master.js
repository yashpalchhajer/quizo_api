'use strict';
const {TABLE_MERCHANT_MASTER} = require('../config/dbConstant');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_MERCHANT_MASTER, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      password:{
        type: Sequelize.STRING(50),
        allowNull:false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      contact_number: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      api_key: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'TERMINATE'),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_MERCHANT_MASTER);
  }
};