'use strict';
const { TABLE_QUIZ_CONFIG } = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const QuizConfigs = sequelize.define(TABLE_QUIZ_CONFIG, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: { model: 'quizcategory', key: 'id' }
    },
    name: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    icon: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    quiz_cost: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    team_size: {
      type: DataTypes.INTEGER(3),
      defaultValue: 0
    },
    min_members: {
      type: DataTypes.INTEGER(3),
      defaultValue: 0
    },
    winner_prize: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'TERMINATE'),
      allowNull: false,
      defaultValue: 'ACTIVE'
    },
  }, {});
  QuizConfigs.associate = function (models) {
    // console.log(models);
    // QuizConfigs.belongsTo(models.qa_quiz_catetories, {
    //   through: 'categories',
    //   as: 'quiz',
    //   foreignKey: 'category_id'
    // });
    // associations can be defined here
  };
  return QuizConfigs;
};