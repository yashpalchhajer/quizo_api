'use strict';
const { TABLE_QUIZ_CONFIG } = require('../config/dbConstant');
const { TABLE_QUIZ_CATEGORY } = require('../config/dbConstant');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_QUIZ_CONFIG, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      category_id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      icon: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      quiz_cost: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
      },
      team_size: {
        type: Sequelize.INTEGER(3),
        defaultValue: 0
      },
      min_members: {
        type: Sequelize.INTEGER(3),
        defaultValue: 0
      },
      winner_prize: {
        type: Sequelize.DOUBLE,
        defaultValue: 0
      },
      quiz_duration:{
        type:Sequelize.DOUBLE(5,2),
        allowNull:false
      },
      no_of_questions:{
        type:Sequelize.INTEGER(3),
        allowNull:false
      },
      question_interval:{
        type:Sequelize.DOUBLE(5,2),
        allowNull:false
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
    }).then(() => queryInterface.addConstraint(TABLE_QUIZ_CONFIG, ['category_id'], {
      type: 'FOREIGN KEY',
      name: 'quiz_category',
      references: {
        table: TABLE_QUIZ_CATEGORY,
        field: 'id'
      },
      onDelete: 'restrict',
      onUpdate: 'no action'
    }));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_QUIZ_CONFIG);
  }
};