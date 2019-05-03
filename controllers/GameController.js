'use strict';
const Player = require('../models').qa_players;
const Validator = require('validatorjs');
const PlayerAvailability = require('../models').qa_players_availables;
const TeamBuilder = require('../libraries/TeamBuilder');

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
        // return res.status(200).json({ error: true, status: 'FAILED', message: "Validation errors", "validation": validator.errors });
        console.log('error at validation ' + validator.errors);
        return false;
    }

    let playerData = await Player.checkPlayerExistance(reqBody.contact_number);

    if (!playerData) {
        // return res.status(200).json({ error: true, status: 'FAILED', message: "No player found with this mobile number" });
        console.log('error at player data ');
        return false;
    }

    let playerAvailable = await PlayerAvailability.checkExistance(playerData);

    if (playerAvailable) {
        // return res.status(200).json({ error: true, status: 'FAILED', message: "Player already requested for play" });
        console.log('error at player available');
        return false;
    }

    /** check player availability and make team to play */

    let reqdata = {
        playerId: playerData.id,
        quizId: reqBody.quiz_id,
        connectionId: reqBody.socket_id
    };

    let teamResp = await TeamBuilder(reqdata);

    if(teamResp.hasOwnProperty('error') && teamResp.error == false && teamResp.hasOwnProperty('status') && teamResp.status == true){
        if(teamResp.hasOwnProperty('data')){
            teamResp.data.players.forEach((player) => {
                global.io.sockets.connected[player.connectionId].emit('teamResp',player);
            });
        }
    }


    console.log(teamResp);
    // return res.status(200).json(teamResp);
    // console.log(global.io.sockets.connected);



    return true;

}


module.exports = {
    requestToPlay
}
