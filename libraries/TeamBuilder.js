'use strict';

const playerAvailability = require('../models').qa_players_availables;
const quizConfigs = require('../models').qa_quiz_configs;
const quizTeam = require('../models').qa_quiz_teams;
const CustomError = require('./customError');

const TeamBuilder = async (req) => {
    try {

        const quizDetails = req.quizConfig;
        if(!quizDetails)
            throw new CustomError("Invalid quiz", 11);
        if ("ACTIVE" == quizDetails.status) {
            await playerAvailability.registerPlayerRequest(req.playerId, quizDetails.id,req.connectionId);
            let availablePlayersList = await playerAvailability.fetchFreePlayersQuizWise(quizDetails.id);
            if (availablePlayersList.count == 0){
                throw new CustomError("No other player exist for requested quiz", 12);
            }
            if (availablePlayersList.count < quizDetails.min_members){
                if(quizDetails.min_members == 2  && req.state == 2){
                    await playerAvailability.registerPlayerRequest(0, quizDetails.id,'system');
                    availablePlayersList = await playerAvailability.fetchFreePlayersQuizWise(quizDetails.id);
                }else{
                    throw new CustomError("No minimum members", 13);
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
            return { error: false, status: true, message: "Team successfully generated", data: responseData, code: 0};
        
        } else {
            throw new CustomError("Quiz not active", 14);
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