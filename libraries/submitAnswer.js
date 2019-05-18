'use strict';

const CustomError = require('./customError');
const quizTeam = require('../models').qa_quiz_teams;
const questionMaster = require('../models').qa_question_masters;
const playerQuestions = require("../models").qa_player_questions;
const quizConfigs = require('../models').qa_quiz_configs;
const date = require('date-and-time');

const submitAnswer = async (req) => {
    try {
        // {
        //     playerId, teamId, questionId, answer[A,B,C,D], questionPushTime
        // }
        console.log("time before submitting answer -: " + Date());
        // fetch question
        let question = await questionMaster.getQuestion(req.questionId);
        // if not exist  error
        if (!question)
            throw new CustomError("Invalid question");
        let isAnswerValid = true;
        // verify answer if not match error
        if(req.answer != question.answer)
            isAnswerValid = false;
        // fetch team players array 
        let quizPlayers = await quizTeam.getTeamPlayersList(req.teamId);
        if(!quizPlayers)
            throw new CustomError("Invalid team");
        // fetch quiz config
        const quizDetails = await quizConfigs.checkExistance(quizPlayers[0].quiz_id);
        let totalQuestionsPushedToTeam = 0;
        // start loop
        quizPlayers.forEach(player => {
            // check player id and update on match
            if(player.player_id == req.playerId){
                // check is player active
                if(!player.questions)
                    player.questions = [];
                let questionObj = {
                    questionId: req.questionId,
                    answer: req.answer,
                    answerTime: date.subtract(new Date(),new Date(req.questionPushTime)).toMilliseconds()
                };
                // push question and answer in questions
                player.questions.push(questionObj);
                // update final_score
                if(isAnswerValid)
                    player.final_score = player.final_score + 1;
                player.update({
                    final_score: player.final_score + 1,
                    questions: player.questions
                });
            }
            if(totalQuestionsPushedToTeam < player.pushed_questions)
                totalQuestionsPushedToTeam = player.pushed_questions;
        });
        // end loop
        let responseData = {
            isCorrect: isAnswerValid,
            nextQuestion: true
        }
        if((quizDetails.no_of_questions - totalQuestionsPushedToTeam) == 0)
            responseData.nextQuestion = false;
        console.log("time after submitting answer -: " + Date());
        return { error: false, status: true, message: 'Success', data: responseData };
    } catch (error) {
        if (error instanceof CustomError) {
            return { error: true, status: false, message: error.message };
        } else {
            console.log(error);
            return { error: true, status: false, message: "Error to submit answer " + error.message };
        }
    }

}

module.exports = submitAnswer;