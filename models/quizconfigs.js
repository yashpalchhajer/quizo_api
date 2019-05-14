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
    quiz_duration: {
      type: DataTypes.INTEGER(3),
      allowNull: false
    },
    no_of_questions: {
      type: DataTypes.INTEGER(3),
      allowNull: false
    },
    question_interval: {
      type: DataTypes.INTEGER(3),
      allowNull: false
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

  QuizConfigs.checkExistance = (quizId) => {
    return new Promise((resolve, reject) => {
      QuizConfigs.findOne(
        {
          raw: true,
          where: {
            id: quizId,
          }
        }
      ).then(quizData => {
        resolve(quizData);
      }).catch(err => {
        reject(err);
      });
    });

  }

  QuizConfigs.getQuiz = () => {
    return new Promise((resolve, reject) => {
      QuizConfigs.findAll(
        {
          raw: true,
          where: {
            status: 'ACTIVE'
          },
          attributes: ['id','name','icon','quiz_cost','team_size','min_members','winner_prize','quiz_duration','no_of_questions','question_interval']
        }
      ).then( (data) => {
        if(!data){
          reject('Error in getting Quiz list!');
        }

        resolve(data);
      }).catch( err => {
        reject(err);
      });
    });
  }



  return QuizConfigs;
};