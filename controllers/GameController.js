'use strict';
const Player = require('../models').qa_players;
const Validator = require('validatorjs');
const PlayerAvailability = require('../models').qa_players_availables;
const TeamBuilder = require('../libraries/TeamBuilder');
const findQuestion = require('../libraries/QuestionFinder');
const QuizTeam = require('../models').qa_quiz_teams;
const QuizConfigs = require('../models').qa_quiz_configs;
const DateHelpers = require('../libraries/DateHandlers');
let schedular = require('node-schedule');
const SubmitAnswer = require('../libraries/submitAnswer');

const requestToPlay = async (req) => {
    let reqBody = req;

    // parameter added

    if(!reqBody.hasOwnProperty('state')){
        reqBody.state = 1;
    }


    /**
     * state    
     *      1 NEW
     *      2 Check
     */
    const rules = {
        contact_number: 'required|min:10|max:10',
        quiz_id: 'required|numeric',
        state: 'required|in:1,2'
    };

    let validator = new Validator(reqBody, rules);
    if (validator.fails()) {
        let err = { error: true, status: 'FAILED', message: "Validation errors", "validation": validator.errors };
        global.io.sockets.connected[reqBody.socket_id].emit('showError', err);
        return false;
    }

    const QuizData = await QuizConfigs.checkExistance(reqBody.quiz_id);
    if (!QuizData) {
        let err = { error: true, status: 'FAILED', message: "Quiz Is Not Active At This Time. Please Try After Some Time !" };
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
    if (prevEntry && prevEntry.length > 0) {
        /* const QuizData = await QuizConfigs.checkExistance(prevEntry[0].quiz_id);
        if(!QuizData){
            console.log('Error in getting quiz config!');
            return false;
        }
            Temp Remove
        */
        let lastMinute = await DateHelpers.addMinutes(prevEntry[0].createdAt, QuizData.quiz_duration);
        // CORRECT lastMinute value and then further
        if (lastMinute > Date.now()) {
            let TeamMembersIds = await QuizTeam.getAllPlayersIds(prevEntry[0].team_id);
            let playerNames = await Player.getDetails(TeamMembersIds.map(p => p.player_id));

            const isSystem = !Object.values(playerNames).findIndex((data) => {return ( (data.name).toUpperCase() == ('system').toUpperCase() )});

            const resp = {
                teamId: prevEntry[0].team_id,
                player: {
                    playerId: prevEntry[0].player_id,
                    connectionId: reqBody.socket_id
                },
                playerData: playerNames,
                quizInfo: {
                    no_of_questions: QuizData.no_of_questions,
                    quiz_duration: QuizData.no_of_questions,
                    question_interval: QuizData.question_interval,
                    isSystem:isSystem
                }
            };
            global.io.sockets.connected[reqBody.socket_id].emit('teamResp', resp);
            return true;
        } else {
            console.log('not running');
        }

    } else {
        console.log('player not found');
    }


    if(reqBody.hasOwnProperty('state') && reqBody.state == 2){
        console.log('to check status');
        /** for future */
    }else{
        /** checked players running quizes */
        let playerAvailable = await PlayerAvailability.checkExistance(playerData);

        if (playerAvailable) {
            let err = { error: true, status: 'FAILED', message: "Player already requested for play" };
            playerAvailable.update({ connection_id: reqBody.socket_id });
            global.io.sockets.connected[reqBody.socket_id].emit('showError', err);
            // console.log('Player has been already requested for play');
            return false;
        }
    }
    /** check player availability and make team to play */

    let reqdata = {
        playerId: playerData.id,
        connectionId: reqBody.socket_id,
        state: reqBody.state,
        quizConfig: QuizData
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

            const isSystem = !Object.values(allPlayerData).findIndex((data) => {return ( (data.name).toUpperCase() == ('system').toUpperCase() )});

		console.log('team resp');
		console.log(isSystem);

            teamResp.data.players.forEach((player) => {
                let resp = {
                    teamId: teamResp.data.teamId,
                    player: player,
                    playerData: allPlayerData,
                    quizInfo: {
                        no_of_questions: QuizData.no_of_questions,
                        quiz_duration: QuizData.no_of_questions,
                        question_interval: QuizData.question_interval,
                        isSystem:isSystem
                    }
                };
		    console.log('player connetion---------------------');
		    console.log(player.connectionId);
                if(player.playerId != 0){
                    global.io.sockets.connected[player.connectionId].emit('teamResp', resp);
                }
            });
        }
    }

    return true;

}

const scheduleQuestion = async (request) => {
    if(!request.quizInfo.isSystem){
        if (global.io.sockets.adapter.rooms[request.teamId].length != 2) {
            return true
        }
    }

    if (global.schedulledJobs.indexOf(request.teamId) != -1) {
        return true;
    }

    global.schedulledJobs.push(request.teamId);

    let questReq = {
        'teamId': request.teamId
    };
    sendQuestion(questReq);

    global.schedulledJobs[request.teamId] = setQueInterval(questReq, request.quizInfo.question_interval);

    // global.schedulledJobs[request.teamId] = schedular.scheduleJob({ start: startTime, end: endTime, rule: '0-59/30 * * * * *' }, async (data) => {
    //     counter++;
    //     let questReq = {
    //         'teamId': request.teamId
    //     };
    //     const question = await findQuestion(questReq);

    //     /** #TODO check response if required */
    //     global.io.sockets.in(roomId).emit('fireQuest', question);
    // });
    console.log('job schedulled schedullar');
    console.log(global.schedulledJobs);
}


const setQueInterval = (queReq, interval) => {
    return setInterval(function () {
        sendQuestion(queReq);
    }, interval * 1000);
};

const sendQuestion = async (quesReq) => {
    const question = await findQuestion(quesReq);
    /** Check question response and do acco
     *  if no question available then clearInterval
     *  if Winnner is then notify for Winner
     */

    if(question.hasOwnProperty('error') && question.error == false){
        // also check multiple checks acc to response
        if(question.message != 'Success'){
            clearInterval(quesReq.teamId);
        }
    }

    global.io.sockets.in(quesReq.teamId).emit('fireQuest', question);
}

const submitUserAnswer = async (req, res) => {

    try {
        let reqBody = req.body;
        const rules = {
            'playerId': 'required|numeric',
            'teamId': 'required',
            'questionId': 'required|numeric',
            'answer': 'required|in:A,B,C,D',
            'questionPushTime': 'required'
        }

        const validator = new Validator(reqBody, rules);

        if (validator.fails()) {
            return res.status(200).json({ error: true, status: 'FAILED', message: 'Validation Errors!', validation: validator.errors });
        }

        let playerData = await Player.getDetailsById(reqBody.playerId);

        if (!playerData) {
            return res.status(200).json({ error: true, status: 'FAILED', message: 'No Player Found With ID' });
        }

        const submitResp = await SubmitAnswer(reqBody);
        let responseData = {
            error: false,
            status: 'SUCCESS'
        };

        if(submitResp.hasOwnProperty('error') && submitResp.error == false){
            if(submitResp.status == true){
                /** Fire Event for Answer submit */
                responseData.data = {
                    playerId: playerData.id,
		    playerName: playerData.name,
	   	    isCorrect: submitResp.data.isCorrect
                };
                global.io.sockets.in(reqBody.teamId).emit('notifyTeam', responseData);

                if(submitResp.data.nextQuestion == true){
                    clearInterval(global.schedulledJobs[reqBody.teamId]);
                    let questReq = {
                        'teamId': reqBody.teamId
                    };
                    console.log('New Question Fired');
                    sendQuestion(questReq);
                    global.schedulledJobs[reqBody.teamId] = setQueInterval(questReq, submitResp.data.questionInterval);
                    console.log(global.schedulledJobs);
                }
                
            }else if(submitResp.status == false){
                // not submitted
            }
        }else{
            // invalid resp
        }

        console.log(submitResp);

        /** Check resp and call fire quest and schedule accordingly */

        return res.status(200).json(submitResp);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: true, status: 'FAILED', message: 'Some Error Ocured on Server!' });
    }
}

const quitGame = async (req,res) => {

    try{
        /**
         * TODO
         * 
         * validate request
         * 
         * check player
         * check Team ,room ID
         * 
         * INACTIVE in team
         * 
         * remove from Room (socket)
         * 
         * get winner state (acc to no of player available in team)
         */

        let reqBody = req.body;

        const rules = {
            contact_number: 'required|min:10|max:10',
        };

        const validator = new Validator(reqBody,rules);

        if(validator.fails()){
            return res.status(204).json({error: true,status: 'FAILED',message: 'Validation Errors!',validation: validator.rules});
        }

        /** check player */

        let playerData = await Player.checkPlayerExistance(reqBody.contact_number);
        if (!playerData) {
            return res.status(401).json({ error: true, status: 'FAILED', message: "Player you ar looking for is not found" });
        }

        /** check in team make global function */

    }catch(err){
        console.log(err);
    }
}
module.exports = {
    requestToPlay,
    scheduleQuestion,
    submitUserAnswer
}
