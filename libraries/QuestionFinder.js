'use strict';

const CustomError = require('./customError');
const quizTeam = require('../models').qa_quiz_teams;
const questionMaster = require('../models').qa_question_masters;
const playerQuestions = require("../models").qa_player_questions;
const quizConfigs = require('../models').qa_quiz_configs;
const findQuestion = async (req) => {
    try {
        const teamId = req.teamId;
        console.log("time before selecting unique question -: " + Date());
        // have to check only active team players and get only active players
        let quizPlayerIds = await quizTeam.getTeamActivePlayersList(teamId);
        if (!quizPlayerIds)
            throw new CustomError("No player found as per team");
        //let response = { error: false, status: false, message: 'Winner', code: 0 };
        let response = { error: false, status: false, message: 'Success', code: 0 };
        //winner work
        // console.log("time before selecting winner -: " + Date());
        // if (quizPlayerIds.length == 1)
        //     response.data = quizPlayerIds[0];
        // let maxScore = 0;
        // let minAnswerTime = 0;
        response = await findWinner(req);
        if(response.status == true)
            return response;
        let totalQuestionsPushedToTeam = 0;

        const playerIds = [];
        let winnerPlayerId = 0;
        //let playersAnswerTime = new Map();
        let quizId = quizPlayerIds[0].quiz_id;
        const quizDetails = await quizConfigs.checkExistance(quizId);
        quizPlayerIds.forEach(player => {
            // let playerAnswerTime = 0;
            // if (player.questions != null)
            //     playerAnswerTime = player.questions.reduce((totalSum, answer) => totalSum + (answer['answerTime'] || 0), 0);
            // playersAnswerTime.set(player.player_id, playerAnswerTime);
            // if (maxScore == player.final_score) {
            //     winnerPlayerId = player.player_id;
            //     if (minAnswerTime == 0 || (playerAnswerTime < minAnswerTime)) {
            //         minAnswerTime = playerAnswerTime;
            //     }
            // } else if (player.final_score > maxScore) {
            //     winnerPlayerId = player.player_id;
            //     maxScore = player.final_score;
            //     minAnswerTime = playerAnswerTime;
            // }
            playerIds.push(player.player_id);
            if (totalQuestionsPushedToTeam < player.pushed_questions)
                totalQuestionsPushedToTeam = player.pushed_questions;
        });
        let totalQuestionInQuiz = quizDetails.no_of_questions;
        let restQuestionsToPush = totalQuestionInQuiz - totalQuestionsPushedToTeam;
        //let winner = true;
        //console.log("minAnswerTime ", minAnswerTime);
        // quizPlayerIds.forEach(player => {
        //     let playerAnswerTime = playersAnswerTime.get(player.player_id);
        //     console.log("playerAnswerTime ", playerAnswerTime);
        //     console.log("maxScore ", maxScore);
        //     console.log("player.player_id ", player.player_id);
        //     console.log("player.final_score ", player.final_score);
        //     if (restQuestionsToPush == 0 && player.questions != null) {
        //         if (totalQuestionInQuiz != player.questions.length) {
        //             let questionsDifference = totalQuestionInQuiz - player.questions.length;
        //             playerAnswerTime = playerAnswerTime + questionsDifference * quizDetails.question_interval * 1000;
        //             playersAnswerTime.set(player.player_id, playerAnswerTime);
        //         }
        //     }
        //     if ((winnerPlayerId != player.player_id) && (player.final_score == maxScore) && (restQuestionsToPush == 0) && (playerAnswerTime == minAnswerTime)) {
        //         response.message = "Draw";
        //         response.code = 1;
        //         response.data = quizPlayerIds;
        //         return response;
        //     } else if ((winnerPlayerId != player.player_id) && (restQuestionsToPush != 0) && (player.final_score + restQuestionsToPush) >= maxScore) {
        //         winner = false;
        //         return false;
        //     }
        // });
        // console.log("playerAnswerTime", playersAnswerTime);
        // console.log("winnerPlayerId ", winnerPlayerId);
        // if (winner) {
        //     response.code = 2;
        //     response.data = quizPlayerIds;
        //     response.winnerId = winnerPlayerId;
        //     //console.log(response);
        //     return response;
        // }

        if (restQuestionsToPush == 0) {
            throw new CustomError('All questions done', 4);
        }

        let playerOldQuestions = await playerQuestions.fetchPlayersQuestions(playerIds, quizId);
        const questions = await questionMaster.fetchQuizWiseQuestions(quizId);
        if (questions.length == 0)
            throw new CustomError("No questions available for quiz", 5);
        let finalQuestion;
        if (playerOldQuestions.length == 0) {
            finalQuestion = questions[0];
            playerIds.forEach(playerId => {
                let player = {
                    player_id: playerId,
                    questions_id: [finalQuestion.id],
                    quiz_id: quizId
                }
                playerOldQuestions.push(player);
            })
        } else {
            let oldQuestions = [];
            playerOldQuestions.forEach(playerQuestion => {
                Array.prototype.push.apply(oldQuestions, playerQuestion.questions_id);
            });
            oldQuestions = [...new Set(oldQuestions)];
            let filteredQuestions = questions.filter(question => !oldQuestions.includes(question.id));
            if (filteredQuestions.length == 0)
                throw new CustomError("No more unique question", 6);
            finalQuestion = filteredQuestions[0];
            if (playerOldQuestions.length != quizPlayerIds.length) {
                let playerMap = new Map();
                playerOldQuestions.forEach(playerQuestion => {
                    playerMap.set(playerQuestion.player_id, playerQuestion);
                });
                quizPlayerIds.forEach(playerId => {
                    let player = playerMap.get(playerId.player_id);
                    if (player == null) {
                        player = {
                            player_id: playerId.player_id,
                            questions_id: [finalQuestion.id],
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
        console.log("time after selecting unique question -: " + Date());
        finalQuestion.questionPushTime = new Date().getTime();
        response.data = finalQuestion;
        response.message = "Success";
        response.code = 0;
        response.status = true;
        return response;
    } catch (error) {
        if (error instanceof CustomError) {
            return { error: true, status: false, message: error.message, code: error.code };
        } else {
            console.log(error);
            return { error: true, status: false, message: "Fail to find question " + error.message, code: 1000 };
        }
    }

}

const findWinner = async (req) => {
    try {
        const teamId = req.teamId;
        console.log("time before start checking winner -: " + Date());
        // have to check only active team players and get only active players
        let quizPlayerIds = await quizTeam.getTeamActivePlayersList(teamId);
        if (!quizPlayerIds)
            throw new CustomError("No player found as per team");
        let response = { error: false, status: true, message: 'Winner', code: 2 };
        //winner work
        if (quizPlayerIds.length == 1) { 
            response.data = quizPlayerIds[0];
            return response;
        }
        let maxScore = 0;
        let minAnswerTime = 0;
        let totalQuestionsPushedToTeam = 0;

        let winnerPlayerId = 0;
        let playersAnswerTime = new Map();
        let quizId = quizPlayerIds[0].quiz_id;
        const quizDetails = await quizConfigs.checkExistance(quizId);
        quizPlayerIds.forEach(player => {
            let playerAnswerTime = 0;
            if (player.questions != null)
                playerAnswerTime = player.questions.reduce((totalSum, answer) => totalSum + (answer['answerTime'] || 0), 0);
            playersAnswerTime.set(player.player_id, playerAnswerTime);
            if (maxScore == player.final_score) {
                winnerPlayerId = player.player_id;
                if (minAnswerTime == 0 || (playerAnswerTime < minAnswerTime)) {
                    minAnswerTime = playerAnswerTime;
                }
            } else if (player.final_score > maxScore) {
                winnerPlayerId = player.player_id;
                maxScore = player.final_score;
                minAnswerTime = playerAnswerTime;
            }
            if (totalQuestionsPushedToTeam < player.pushed_questions)
                totalQuestionsPushedToTeam = player.pushed_questions;
        });
        let totalQuestionInQuiz = quizDetails.no_of_questions;
        let restQuestionsToPush = totalQuestionInQuiz - totalQuestionsPushedToTeam;
        let winner = true;
        console.log("minAnswerTime ", minAnswerTime);
        quizPlayerIds.forEach(player => {
            let playerAnswerTime = playersAnswerTime.get(player.player_id);
            console.log("playerAnswerTime ", playerAnswerTime);
            console.log("maxScore ", maxScore);
            console.log("player.player_id ", player.player_id);
            console.log("player.final_score ", player.final_score);
            if (restQuestionsToPush == 0 && player.questions != null) {
                if (totalQuestionInQuiz != player.questions.length) {
                    let questionsDifference = totalQuestionInQuiz - player.questions.length;
                    playerAnswerTime = playerAnswerTime + questionsDifference * quizDetails.question_interval * 1000;
                    playersAnswerTime.set(player.player_id, playerAnswerTime);
                }
            }
            if ((winnerPlayerId != player.player_id) && (player.final_score == maxScore) && (restQuestionsToPush == 0) && (playerAnswerTime == minAnswerTime)) {
                response.message = "Draw";
                response.code = 1;
                response.data = quizPlayerIds;
                return response;
            } else if ((winnerPlayerId != player.player_id) && (restQuestionsToPush != 0) && (player.final_score + restQuestionsToPush) >= maxScore) {
                winner = false;
                return false;
            }
        });
        console.log("playerAnswerTime", playersAnswerTime);
        console.log("winnerPlayerId ", winnerPlayerId);
        if (winner) {
            response.code = 2;
            response.data = quizPlayerIds;
            response.winnerId = winnerPlayerId;
            //console.log(response);
            //return response;
        } else {
            response.message = "No winner found yet";
            response.code = 0;
            response.status = false;
        }
        console.log("time after start checking winner -: " + Date());
        return response;
    } catch (error) {
        if (error instanceof CustomError) {
            return { error: true, status: false, message: error.message, code: error.code };
        } else {
            console.log(error);
            return { error: true, status: false, message: "Error in finding winner " + error.message, code: 1000 };
        }
    }
}
module.exports = {
    findQuestion,
    findWinner
}