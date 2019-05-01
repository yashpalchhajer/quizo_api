'use strict';

const playerAvailability = require('../models').qa_player_availables;
const quizConfigs = require('../models').qa_quiz_configs;
const quizTeam = require('../models').qa_quiz_teams;
const CustomError = require('./customError');
const { TABLE_QUIZ_TEAM } = require('../config/dbConstant');

const TeamBuilder = async (req) => {
    try {
        const quizDetails = await quizConfigs.checkExistance(req.quizId);
        if("ACTIVE" == quizDetails.status) {
            await playerAvailability.registerPlayerRequest(req.playerId, req.quizId);
            const availablePlayersList = await playerAvailability.fetchFreePlayersQuizWise(req.quizId);
            let playerFree = "TRUE";
            if(availablePlayersList.count == 0)
                throw new CustomError("No other player exist for requested quiz");
            else if(availablePlayersList.count <= quizDetails.min_members)
                throw new CustomError("No minimum members");
            else {
                let teamId = "xyz";
                const teamData = [];
                const updatePlayer = [];
                availablePlayersList.rows.foreach(player => {
                    let teamPlayer = {
                        player_id : player.player_id,
                        quiz_id : req.quizId,
                        team_id : teamId
                    };
                    let playerAva = {
                        player_id = player.player_id,
                        quiz_id = req.quizId
                    }
                    teamData.push(teamPlayer);
                    updatePlayer.push(playerAva);
                });
                await quizTeam.registerNewTeam(teamData);
                await playerAvailability.updatePlayersToBusy(updatePlayer);
            }
        } else {
            throw new CustomError("Quiz Not Active");
        }
    } catch (error) {
        if(error instanceof CustomError){
            return json({error:true,status:"FAILED",message: error.message});
        } else {
            console.log(error);
            return json({error:true,status:"FAILED",message: "Exception in team generation" + error.message});
        }
    }
}

module.exports = TeamBuilder;