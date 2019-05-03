'use strict';

const playerAvailability = require('../models').qa_players_availables;
const quizConfigs = require('../models').qa_quiz_configs;
const quizTeam = require('../models').qa_quiz_teams;
const CustomError = require('./customError');

const TeamBuilder = async (req) => {
    try {

        const quizDetails = await quizConfigs.checkExistance(req.quizId);
        if(!quizDetails)
            throw new CustomError("Invalid quiz");
        if ("ACTIVE" == quizDetails.status) {
            await playerAvailability.registerPlayerRequest(req.playerId, req.quizId,req.connectionId);
            const availablePlayersList = await playerAvailability.fetchFreePlayersQuizWise(req.quizId);
            if (availablePlayersList.count == 0)
                throw new CustomError("No other player exist for requested quiz");
            else if (availablePlayersList.count < quizDetails.min_members)
                throw new CustomError("No minimum members");
            else {
                let teamId = req.quizId + Date.now();
                const teamData = [];
                const updatePlayer = [];
                const responsePlayerData = [];
                availablePlayersList.rows.forEach(player => {
                    let teamPlayer = {
                        player_id: player.player_id,
                        quiz_id: req.quizId,
                        team_id: teamId
                    };
                    let playerData = {
                        playerId: player.player_id,
                        connectionId: player.connection_id,
                        name: player.name
                    }
                    responsePlayerData.push(playerData);
                    updatePlayer.push(player.player_id);
                    teamData.push(teamPlayer);
                })
                await playerAvailability.updatePlayersWithTeam(updatePlayer, req.quizId, "FALSE", teamId);
                await quizTeam.registerNewTeam(teamData);
                let responseData = {
                    teamId: teamId,
                    players: responsePlayerData
                }
                return { error: false, status: true, message: "Team successfully generated", data: responseData};
            }
        } else {
            throw new CustomError("Quiz not active");
        }
    } catch (error) {
        if (error instanceof CustomError) {
            return { error: false, status: false, message: error.message };
        } else {
            console.log(error);
            return { error: true, status: false, message: "Exception in team generation " + error.message };
        }
    }
}

module.exports = TeamBuilder;