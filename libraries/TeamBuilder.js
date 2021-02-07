'use strict';

const playerAvailability = require('../models').qa_players_availables;
const quizConfigs = require('../models').qa_quiz_configs;
const quizTeam = require('../models').qa_quiz_teams;
const CustomError = require('./customError');
const messages = require('../config/ErrorCode');

const TeamBuilder = async (req) => {
    try {

        const quizDetails = req.quizConfig;
        if(!quizDetails)
            throw new CustomError(messages.INVALID_QUIZ_MESSAGE, messages.INVALID_QUIZ_CODE);
        if ("ACTIVE" == quizDetails.status) {
            await playerAvailability.registerPlayerRequest(req.playerId, quizDetails.id,req.connectionId);
            let availablePlayersList = await playerAvailability.fetchFreePlayersQuizWise(quizDetails.id);
            if (availablePlayersList.count == 0){
                throw new CustomError(messages.NO_OTHER_PLAYER_EXIST_FOR_REQUESTED_QUIZ_MESSAGE, messages.NO_OTHER_PLAYER_EXIST_FOR_REQUESTED_QUIZ_CODE);
            }
            if (availablePlayersList.count < quizDetails.min_members){
                if(quizDetails.min_members == 2  && req.state == 2){
                    await playerAvailability.registerPlayerRequest(0, quizDetails.id,'system');
                    availablePlayersList = await playerAvailability.fetchFreePlayersQuizWise(quizDetails.id);
                }else{
                    throw new CustomError(messages.NO_MINIMUM_PLAYER_MESSAGE, messages.NO_MINIMUM_PLAYER_CODE);
                }
            }
            
            let teamId = quizDetails.id + Date.now();
            const teamData = [];
            const updatePlayer = [];
            const responsePlayerData = [];
            availablePlayersList.rows.forEach(player => {
                let teamPlayer = {
                    player_id: player.player_id,
                    quiz_id: quizDetails.id,
                    team_id: teamId
                };
                let playerData = {
                    playerId: player.player_id,
                    connectionId: player.connection_id,
                }
                responsePlayerData.push(playerData);
                updatePlayer.push(player.player_id);
                teamData.push(teamPlayer);
            })
            await playerAvailability.updatePlayersWithTeam(updatePlayer, quizDetails.id, "FALSE", teamId);
            await quizTeam.registerNewTeam(teamData);
            let responseData = {
                teamId: teamId,
                players: responsePlayerData,
                playerIds: updatePlayer
            }
            return { error: false, status: true, message: messages.SUCCESS_MESSAGE, data: responseData, code: messages.SUCCESS_CODE};
        
        } else {
            throw new CustomError(messages.QUIZ_NOT_ACTIVE_MESSAGE, messages.QUIZ_NOT_ACTIVE_CODE);
        }
    } catch (error) {
        if (error instanceof CustomError) {
            return { error: false, status: false, message: error.message, code:error.code };
        } else {
            console.log(error);
            return { error: true, status: false, message: "Exception in team generation " + error.message,code :1000 };
        }
    }
}

module.exports = TeamBuilder;