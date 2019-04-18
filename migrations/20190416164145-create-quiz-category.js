'use strict';
const { TABLE_QUIZ_CATEGORY } = require('../config/dbConstant');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_QUIZ_CATEGORY, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'TERMINATE'),
        allowNull: false,
        defaultValue: 'ACTIVE'
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_QUIZ_CATEGORY);
  }
};