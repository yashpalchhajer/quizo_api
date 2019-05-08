'use strict';
const {TABLE_QUESTION_MASTER} = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const QuestionMaster = sequelize.define(TABLE_QUESTION_MASTER, {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    quiz_category_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    question_string:{
      type: DataTypes.TEXT,
      allowNull: false
    },
    options:{
      type: DataTypes.JSON,
      allowNull: false
    },
    answer:{
      type: DataTypes.ENUM('A','B','C','D'),
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {});
  QuestionMaster.associate = function(models) {
    // associations can be defined here
    QuestionMaster.belongsTo(models.qa_question_master,{
      through: 'category_id',
      as: 'quiz_category',
      foreignKey: 'quiz_category_id'
    });
  };
  return QuestionMaster;
};