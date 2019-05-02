'use strict';

// const playerAvailability = require('../models').qa_player_availables;
const playerAvailability = require('../models').qa_players_availables;
const quizConfigs = require('../models').qa_quiz_configs;
const quizTeam = require('../models').qa_quiz_teams;
const CustomError = require('./customError');
const { TABLE_QUIZ_TEAM } = require('../config/dbConstant');
const TeamBuilder = async (req) => {
    try {

        const quizDetails = await quizConfigs.checkExistance(req.quizId);
        if(!quizDetails)
            throw new CustomError("Invalid Quiz");
        if ("ACTIVE" == quizDetails.status) {
            await playerAvailability.registerPlayerRequest(req.playerId, req.quizId);
            const availablePlayersList = await playerAvailability.fetchFreePlayersQuizWise(req.quizId);
            if (availablePlayersList.count == 0)
                throw new CustomError("No other player exist for requested quiz");
            else if (availablePlayersList.count < quizDetails.min_members)
                throw new CustomError("No minimum members");
            else {
                let teamId = req.quizId + Date.now();
                console.log(teamId);
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
                        playerId: player.player_id
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
                return { error: false, status: "TRUE", message: "Team Successfully Generated", data: responseData};
            }
        } else {
            throw new CustomError("Quiz Not Active");
        }
    } catch (error) {
        if (error instanceof CustomError) {
            return { error: false, status: "FAILED", message: error.message };
        } else {
            console.log(error);
            return { error: true, status: "FAILED", message: "Exception in team generation " + error.message };
        }
    }
}

module.exports = TeamBuilder;