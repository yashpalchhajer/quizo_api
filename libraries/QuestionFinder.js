'use strict';

const CustomError = require('./customError');
const quizTeam = require('../models').qa_quiz_teams;
const questionMaster = require('../models').qa_question_masters;
const playerQuestions = require("../models").qa_player_questions;
const date = require('date-and-time');

const findQuestion = async (req) => {
    try{
        const teamId = req.teamId;
        console.log("time before selecting unique question -: " + Date());
        // have to check only active team players and get only active players
        let quizPlayerIds = await quizTeam.getTeamPlayersList(teamId);
        if(!quizPlayerIds)
            throw new CustomError("No player found as per team");
        const playerIds = [];
        let quizId;
        quizPlayerIds.forEach(player => {
            playerIds.push(player.player_id);
            quizId = player.quiz_id;
        });
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
            finalQuestion.questionPushTime = new Date().getTime();
            if(playerOldQuestions.length != quizPlayerIds.length) {
                let playerMap = new Map();
                playerOldQuestions.forEach(playerQuestion => {
                    playerMap.set(playerQuestion.player_id, playerQuestion);
                });
                quizPlayerIds.forEach(playerId => {
                    let player = playerMap.get(playerId.player_id);
                    console.log(player);
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
        return { error: false, status: true, message: 'Success',data: finalQuestion };
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