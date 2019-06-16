'use strict'

const QuizConfig = require('../models').qa_quiz_configs
const Player = require('../models').qa_players;
const Validator = require('validatorjs');
const QuizTeam = require('../models').qa_quiz_teams;
const DateHelpers = require('../libraries/DateHandlers');
const QuizConfigs = require('../models').qa_quiz_configs;

const quizList = async (req, res) => {

    try {

        const quizs = await QuizConfig.getQuiz();

        let responseArr = {};
        if (!quizs) {
            responseArr = {
                "error": true,
                "status": "FAILED",
                "message": 'No Quiz Available Right Now!'
            };
            return res.status(200).json(responseArr);
        }

        if (quizs.length <= 0) {
            responseArr = {
                "error": false,
                "status": "FAILED",
                "message": 'No Quiz Available Right Now!',
                "data": quizs
            }
            return res.status(200).json(responseArr);
        }


        responseArr = {
            "error": false,
            "status": "SUCCESS",
            "message": 'Quiz configs',
            "data": quizs
        }

        return res.status(200).json(responseArr);
    } catch (err) {
        responseArr = {
            "error": true,
            "status": "FAILED",
            "message": err
        }
        return res.status(200).json(responseArr);
    }
}


const getPlayerDashboard = async (req, res) => {
    /**
     * provide player data
     *  Info,
     *  Last Quiz's played by him and its Winner state,
     *  Wallet Info
     *  *anything else if required
     */

    let reqBody = req.query;

    const rules = {
        'contact_number': 'required|min:10|max:10'
    };

    const validator = new Validator(reqBody, rules);

    if (validator.fails()) {
        return res.status(422).json({ error: true, status: 'FAILED', message: 'Validation Errors', validation: validator.errors });
    }

    let playerData = await Player.checkPlayerExistance(reqBody.contact_number);
    if (!playerData) {
        return res.status(401).json({ error: true, status: 'FAILED', message: "Player you ar looking for is not found" });
    }

    let teamData = {};
    let responseArr = {
        error: false,
        status: 'SUCCESS',
        isPlaying: false,
        playerInfo: {
            id: playerData.id,
            name: playerData.name,
            email: playerData.email,
            gender: playerData.gender,
            profile_img_url: playerData.profile_img_url
        },

    };
    /** check Player is currently runnning or not */
    let prevEntry = await QuizTeam.getPlayerEntry(playerData.id);
    if (prevEntry && prevEntry.length > 0) {
        const QuizData = await QuizConfigs.checkExistance(prevEntry[0].quiz_id);
        if(!QuizData){
            return res.status(401).json({ error: true, status: 'FAILED', message: "Error in getting quiz config data" });
        }
        
        let lastMinute = await DateHelpers.addMinutes(prevEntry[0].createdAt, QuizData.quiz_duration);
        // CORRECT lastMinute value and then further
        if (lastMinute > Date.now()) {
            let TeamMembersIds = await QuizTeam.getAllPlayersIds(prevEntry[0].team_id);
            let playerNames = await Player.getDetails(TeamMembersIds.map(p => p.player_id));

            teamData = {
                teamId: prevEntry[0].team_id,
                player: {
                    playerId: prevEntry[0].player_id,
                    connectionId: reqBody.socket_id
                },
                playerData: playerNames,
                quizInfo: {
                    no_of_questions: QuizData.no_of_questions,
                    quiz_duration: QuizData.no_of_questions,
                    question_interval: QuizData.question_interval
                }
            };
            responseArr.isPlaying = true;
            responseArr.teamData = teamData;

        } else {
            console.log('not running');
        }

    } else {
        console.log('player not found');
    }


    /** fetch more data */

    return res.status(200).json(responseArr);
}

module.exports = {
    quizList,
    getPlayerDashboard
}