'use strict';

const { TABLE_QUIZ_CATEGORY } = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const QuizCategory = sequelize.define(TABLE_QUIZ_CATEGORY, {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'TERMINATE'),
      allowNull: false,
      defaultValue: 'ACTIVE'
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {});
  QuizCategory.associate = function (models) {
    // associations can be defined here
  };
  return QuizCategory;
};