'use strict';
const Player = require('../models').qa_players;
const Validator = require('validatorjs');
const PlayerAvailability = require('../models').qa_players_availables;
const TeamBuilder = require('../libraries/TeamBuilder');
const findQuestion = require('../libraries/QuestionFinder');
const QuizTeam = require('../models').qa_quiz_teams;
const QuizConfigs = require('../models').qa_quiz_configs;
const DateHelpers = require('../libraries/DateHandlers');

const requestToPlay = async (req) => {
    let reqBody = req;

    // parameter added
    reqBody['quiz_id'] = 1;

    const rules = {
        contact_number: 'required|min:10|max:10',
        quiz_id: 'required|numeric'
    };

    let validator = new Validator(reqBody, rules);
    if (validator.fails()) {
        let err = { error: true, status: 'FAILED', message: "Validation errors", "validation": validator.errors };
        global.io.sockets.connected[reqBody.socket_id].emit('showError', err);
        return false;
    }

    let playerData = await Player.checkPlayerExistance(reqBody.contact_number);

    if (!playerData) {
        let err = { error: true, status: 'FAILED', message: "No player found with this mobile number" };
        global.io.sockets.connected[reqBody.socket_id].emit('showError', err);
        return false;
    }

    /** get player checked in Already running quizes */

    let prevEntry = await QuizTeam.getPlayerEntry(playerData.id);
    if(prevEntry && prevEntry.length > 0){
        const QuizData = await QuizConfigs.checkExistance(prevEntry[0].quiz_id);
        if(!QuizData){
            console.log('Error in getting quiz config!');
            return false;
        }
        let lastMinute = await DateHelpers.addMinutes(prevEntry[0].createdAt,QuizData.quiz_duration);
        // CORRECT lastMinute value and then further
        if(lastMinute > Date.now())
        {
            let TeamMembersIds = await QuizTeam.getAllPlayersIds(prevEntry[0].team_id);
            let playerNames = await Player.getDetails(TeamMembersIds.map(p => p.player_id));

            const resp = {
                teamId: prevEntry[0].team_id,
                player: {
                    playerId: prevEntry[0].player_id,
                    connectionId: reqBody.socket_id
                },
                playerData: playerNames
            };
            global.io.sockets.connected[reqBody.socket_id].emit('teamResp', resp);
            return true;
        }else{
            console.log('not running');
        }

    }else{
        console.log('player not found');
    }


    /** checked players running quizes */
    let playerAvailable = await PlayerAvailability.checkExistance(playerData);

    if (playerAvailable) {
        let err = { error: true, status: 'FAILED', message: "Player already requested for play" };
        global.io.sockets.connected[reqBody.socket_id].emit('showError',err);
        // console.log('Player has been already requested for play');
        return false;
    }

    /** check player availability and make team to play */

    let reqdata = {
        playerId: playerData.id,
        quizId: reqBody.quiz_id,
        connectionId: reqBody.socket_id
    };

    let teamResp = await TeamBuilder(reqdata);
    // console.log("teamBuilder response-: ");
    // console.log(+teamResp);
    // let questionResponse = await findQuestion(teamResp.data);
    // console.log(questionResponse);
    if (teamResp.hasOwnProperty('error') && teamResp.error == false && teamResp.hasOwnProperty('status') && teamResp.status == true) {
        if (teamResp.hasOwnProperty('data')) {

            let allPlayerData = {};
            if (teamResp.hasOwnProperty('data') && teamResp.data.hasOwnProperty('playerIds')) {
                allPlayerData = await Player.getDetails(teamResp.data.playerIds);
            }
            
            teamResp.data.players.forEach((player) => {
                let resp = {
                    teamId: teamResp.data.teamId,
                    player: player,
                    playerData: allPlayerData
                };
                global.io.sockets.connected[player.connectionId].emit('teamResp', resp);
            });
        }
    }
    

    // console.log(teamResp);
    // return res.status(200).json(teamResp);
    // console.log(global.io.sockets.connected);



    return true;

}


module.exports = {
    requestToPlay
}
