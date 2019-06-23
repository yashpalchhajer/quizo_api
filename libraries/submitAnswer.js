'use strict';

const CustomError = require('./customError');
const quizTeam = require('../models').qa_quiz_teams;
const questionMaster = require('../models').qa_question_masters;
const quizConfigs = require('../models').qa_quiz_configs;
const date = require('date-and-time');
const sequelize = require('../models/index').sequelize;
const messages = require('../config/ErrorCode');

const submitAnswer = async (req) => {
    let transaction;
    try {
        // {
        //     playerId, teamId, questionId, answer[A,B,C,D], questionPushTime
        // }
        // fetch question
        transaction = await sequelize.transaction();
        let question = await questionMaster.getQuestion(req.questionId, transaction);
        // if not exist  error
        if (!question)
            throw new CustomError(messages.INVALID_QUESTION_MESSAGE, messages.INVALID_QUESTION_CODE);
        let isAnswerValid = true;
        // verify answer if not match error
        if (req.answer != question.answer)
            isAnswerValid = false;
        // fetch team players array 
        let quizPlayers = await quizTeam.getTeamActivePlayersList(req.teamId, transaction);
        if (!quizPlayers)
            throw new CustomError(messages.INVALID_TEAM_MESSAGE, messages.INVALID_TEAM_CODE);
        // fetch quiz config
        const quizDetails = await quizConfigs.checkExistance(quizPlayers[0].quiz_id, transaction);
        let totalQuestionsPushedToTeam = 0;

        let nextQuestion = true;
        let invalidPlayer = true;
        // start loop
        let questions, score;
        quizPlayers.forEach(player => {
            // check is player submitted this question's answer
            let oldQuestion = false;

            if (player.questions != null) {
                oldQuestion = player.questions.some(answer => {
                    return answer['questionId'] == req.questionId
                });
            }
            // check player id and update on match
            if (player.player_id == req.playerId) {
                // check is player active
                if (!player.questions)
                    player.questions = [];
                if (oldQuestion)
                    throw new CustomError(messages.PLAYER_ALREADY_SUBMITTED_THIS_QUESTION_ANSWER_MESSAGE, messages.PLAYER_ALREADY_SUBMITTED_THIS_QUESTION_ANSWER_CODE);
                oldQuestion = true;
                let questionObj = {
                    questionId: req.questionId,
                    answer: req.answer,
                    answerTime: date.subtract(new Date(), new Date(req.questionPushTime)).toMilliseconds()
                };
                // push question and answer in questions
                player.questions.push(questionObj);
                questions = player.questions;
                // update final_score
                score = player.final_score;
                if (isAnswerValid)
                    score = score + 1;
                invalidPlayer = false;
            }
            if (totalQuestionsPushedToTeam < player.pushed_questions)
                totalQuestionsPushedToTeam = player.pushed_questions;
            if (nextQuestion)
                nextQuestion = oldQuestion;

        });
        // end loop
        if (invalidPlayer)
            throw new CustomError(messages.INVALID_PLAYER_MESSAGE, messages.INVALID_PLAYER_CODE);
        else {
            await quizTeam.updateQuizPlayerScoreAndQuestions(score, questions, req.teamId, req.playerId, transaction);
        }
        let responseData = {
            isCorrect: isAnswerValid,
            nextQuestion: nextQuestion,
            questionInterval: quizDetails.question_interval,
            restQuestionsToPush: quizDetails.no_of_questions - totalQuestionsPushedToTeam
        }
        if ((quizDetails.no_of_questions - totalQuestionsPushedToTeam) == 0)
            responseData.nextQuestion = false;
        await transaction.commit()
        return { error: false, status: true, message: messages.SUCCESS_MESSAGE, data: responseData, code: messages.SUCCESS_CODE };
    } catch (error) {
        await transaction.rollback();
        if (error instanceof CustomError) {
            return { error: true, status: false, message: error.message, code: error.code };
        } else {
            console.log(error);
            return { error: true, status: false, message: "Error to submit answer " + error.message, code: 1000 };
        }
    }

}

module.exports = submitAnswer;