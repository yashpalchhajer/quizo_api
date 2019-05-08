'use strict';
const { TABLE_QUESTION_MASTER } = require('../config/dbConstant');
const { TABLE_QUIZ_CATEGORY } = require('../config/dbConstant');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_QUESTION_MASTER, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quiz_category_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      question_string: {
        type: Sequelize.TEXT + ' CHARSET utf8 COLLATE utf8_unicode_ci',
        allowNull: false
      },
      options: {
        type: Sequelize.JSON,
        allowNull: false
      },
      answer: {
        type: Sequelize.ENUM('A', 'B', 'C', 'D'),
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
    })
      .then(() => queryInterface.addConstraint(TABLE_QUESTION_MASTER, ['quiz_category_id'], {
        type: 'FOREIGN KEY',
        name: 'quiz-category',
        references: {
          table: TABLE_QUIZ_CATEGORY,
          field: 'id'
        },
        onDelete: 'restrict',
        onUpdate: 'no action'
      }));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_QUESTION_MASTER);
  }
};