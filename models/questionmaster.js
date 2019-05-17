'use strict';
const { TABLE_QUESTION_MASTER } = require('../config/dbConstant');
const { TABLE_QUIZ_CONFIG } = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const QuestionMaster = sequelize.define(TABLE_QUESTION_MASTER, {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    question_string: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false
    },
    answer: {
      type: DataTypes.ENUM('A', 'B', 'C', 'D'),
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
  QuestionMaster.associate = function (models) {
    // associations can be defined here
    QuestionMaster.belongsTo(models.qa_question_masters, {
      through: 'quiz_number',
      as: TABLE_QUIZ_CONFIG,
      foreignKey: 'quiz_id'
    });
  };

  QuestionMaster.fetchQuizWiseQuestions = (quizId) => {
    return new Promise((resolve, reject) => {
      QuestionMaster.findAll({
        raw: true,
        where: {
          quiz_id: quizId
        },
        attributes: { exclude: ['answer', 'createdAt', 'updatedAt', 'quiz_id'] }
      }).then((questionsList) => resolve(questionsList))
        .catch((err) => {
          reject(err)
        });
    });
  }

  QuestionMaster.getQuestion = (questionId) => {
    new Promise((resolve, reject) => {
      QuestionMaster.find({
        where: {
          id: questionId
        },
        attributes: { exclude: ['question_string','options', 'createdAt', 'updatedAt'] }
      }).then((question) => resolve(question))
        .catch((err) => reject(err));
    })
  }
  return QuestionMaster;
};