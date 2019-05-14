'use strict'

const QuizConfig = require('../models').qa_quiz_configs

const quizList = async (req, res) => {

    try{

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
    }catch(err){
        responseArr = {
            "error": true,
            "status": "FAILED",
            "message": err
        }
        return res.status(200).json(responseArr);
    }
}

module.exports = {
    quizList
}