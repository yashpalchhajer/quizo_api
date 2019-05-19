'use strict';

const CustomError = require('./customError');
const quizTeam = require('../models').qa_quiz_teams;
const questionMaster = require('../models').qa_question_masters;
const playerQuestions = require("../models").qa_player_questions;
const quizConfigs = require('../models').qa_quiz_configs;
const findQuestion = async (req) => {
    try{
        const teamId = req.teamId;
        console.log("time before selecting unique question -: " + Date());
        // have to check only active team players and get only active players
        let quizPlayerIds = await quizTeam.getTeamPlayersList(teamId);
        if(!quizPlayerIds)
            throw new CustomError("No player found as per team");
        let response = { error: false, status: false, message: 'Winner' };
        //winner work
        console.log("time before selecting winner -: " + Date());
        if(quizPlayerIds.length == 1)
            response.data = quizPlayerIds[0];
        let maxScore = 0;
        let minAnswerTime = 0;
        let totalQuestionsPushedToTeam = 0;

        const playerIds = [];
        let quizId;
        let winnerPlayerId = 0;
        let playersAnswerTime = new Map();
        quizPlayerIds.forEach(player => {
            let playerAnswerTime = 0;
            if(player.questions != null)
                playersAnswerTime.set(player.player_id,player.questions.reduce((totalSum,answer) => totalSum + (answer['answerTime'] || 0),0));
            if(maxScore == player.final_score) {
                winnerPlayerId = player.player_id;
                if(minAnswerTime == 0 || (minAnswerTime > playerAnswerTime)) {
                    minAnswerTime = playerAnswerTime;
                }
            } else if(maxScore < player.final_score) {
                winnerPlayerId = player.player_id;
                maxScore = player.final_score;
                minAnswerTime = playerAnswerTime;
            }
            playerIds.push(player.player_id);
            quizId = player.quiz_id;
            if(totalQuestionsPushedToTeam < player.pushed_questions)
                totalQuestionsPushedToTeam = player.pushed_questions;
        });
        const quizDetails = await quizConfigs.checkExistance(quizId);
        let restQuestionsToPush = quizDetails.no_of_questions - totalQuestionsPushedToTeam;
        let winner = true;
        quizPlayerIds.forEach(player => {
            let playerAnswerTime = playersAnswerTime.get(player.player_id);
            if((player.final_score == maxScore) && (restQuestionsToPush == 0) && (playerAnswerTime == minAnswerTime)) {
                response.message = "Draw";
                response.data = quizPlayerIds;
                return response;
            } else if((player.final_score + restQuestionsToPush) >= maxScore) {
                winner = false;
                return false;
            }
        });
        if(winner) {
            response.data = quizPlayerIds;
            response.data.winnerId = winnerPlayerId;
            return response;
        }
        console.log("time after selecting winner -: " + Date());

        let playerOldQuestions = await playerQuestions.fetchPlayersQuestions(playerIds, quizId);
        const questions = await questionMaster.fetchQuizWiseQuestions(quizId);
        if(questions.length == 0)
            throw new CustomError("No questions available for quiz");
        let finalQuestion;
        if(playerOldQuestions.length == 0) {
            finalQuestion = questions[0];
            playerIds.forEach(playerId => {
                let player = {
                    player_id : playerId,
                    questions_id : [finalQuestion.id],
                    quiz_id: quizId
                }
                playerOldQuestions.push(player);
            })
        } else {
            let oldQuestions = [];
            playerOldQuestions.forEach(playerQuestion => {
                Array.prototype.push.apply(oldQuestions,playerQuestion.questions_id);
            });
            oldQuestions = [...new Set(oldQuestions)];
            let filteredQuestions = questions.filter(question => !oldQuestions.includes(question.id));
            if(filteredQuestions.length == 0)
                throw new CustomError("No more unique question");
            finalQuestion = filteredQuestions[0];
            if(playerOldQuestions.length != quizPlayerIds.length) {
                let playerMap = new Map();
                playerOldQuestions.forEach(playerQuestion => {
                    playerMap.set(playerQuestion.player_id, playerQuestion);
                });
                quizPlayerIds.forEach(playerId => {
                    let player = playerMap.get(playerId.player_id);
                    if(player == null) {
                        player = {
                            player_id : playerId.player_id,
                            questions_id : [finalQuestion.id],
                            quiz_id: quizId
                        }
                        playerMap.set(playerId.player_id, player);
                    } else {
                        player.questions_id.push(finalQuestion.id);
                    }
                });
                playerOldQuestions = Array.from(playerMap.values());
            } else {
                playerOldQuestions.forEach(player => {
                    player.questions_id.push(finalQuestion.id);
                });
            }
        }
        await playerQuestions.insertPlayersQuestion(playerOldQuestions);
        await quizTeam.updatePushedQuestionsCount(playerIds, 1, teamId);
        console.log("time after selecting unique question -: "+Date());
        finalQuestion.questionPushTime = new Date().getTime();
        response.data = finalQuestion;
        response.message = "Success";
        response.status = true;
        return response;
    }catch(error){
        if (error instanceof CustomError) {
            return { error: true, status: false, message: error.message };
        } else {
            console.log(error);
            return { error: true, status: false, message: "Fail to find question " + error.message };
        }
    }

}

module.exports = findQuestion;