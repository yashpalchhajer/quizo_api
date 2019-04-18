'use strict';
const Player = require('../models').qa_players;
const Validator = require('validator');
const PlayerAvailability = require('../models').qa_player_availables;

const requstToPlay = async (req, res) => {
    let reqBody = req.body;

    // parameter added
    reqBody['quiz_id'] = 1;

    const rules = {
        contact_number: 'required|min:10|max:10',
        quiz_id: 'required|numeric'
    };

    let validator = new Validator(reqBody, rules);
    if (validator.fails()) {
        return res.status(400).json({ error: true, status: 'FAILED', message: "Validation errors", "validation": validator.errors });
    }

    let playerData = await Player.checkPlayerExistance(reqBody.contact_number);

    if (!playerData) {
        return res.status(400).json({ error: true, status: 'FAILED', message: "No player found with this mobile number" });
    }

    let playerAvailable = await PlayerAvailability.checkExistance(playerData);

    if (playerAvailable) {
        return res.status(400).json({ error: true, status: 'FAILED', message: "Player already requested for play" });
    }

    /** check player availability and make team to play */

    



}


