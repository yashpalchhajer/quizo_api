
'use strict';

const Plans = require('../mongoose/Plans');
const Validator = require('validatorjs');
const ErrorCodes = require('../config/ErrorCode');
const Providers = require('../models').qa_api_providers;
/**
 * to be used in future
 * # need improvements
 */
const createNew = async (req, res) => {

    let reqBody = req.body;
    const rules = {
        'name': 'required|string',
        'decription': 'required|string',
        'indian_rupie': 'required|number',
        'coin_per_rupie': 'required|number',
        'plan_type': 'required',
        'status': 'required|in:ACTIVE,INACTIVE'
    };

    const validator = new Validator(reqBody, rules);
    if (validator.fails()) {
        return res.status(400).json({ error: true, status: 'FAILED', message: "Validation errors", "validation": validator.errors });
    }

    const plan = await Plans.newPlan(reqBody);

    return res.status(200).json(plan);
}

const getPlans = async (req, res) => {

    try{

        let reqBody = req.query;
        
        if(!req.hasOwnProperty('player') || req.player == undefined ){
            return res.status(ErrorCodes.PLAYER_NOT_FOUND_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.PLAYER_NOT_FOUND_MESSAGE });
        }
        
        let plans = await Plans.getPlan();
        
        let responseArr = {
            "error": false,
            "status": "SUCCESS",
            "data": plans
        };

        return res.status(200).json(responseArr);

    }catch(err){
        console.error(err);
        return res.status(ErrorCodes.SERVER_ERROR_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.SERVER_ERROR_MESSAGE });
    }


 
}

const getProvider = async (req,res) => {
    try{
        let reqBody = req.query;

        const rules = {
            "type": 'required|string|in:PAYMENT'
        };

        const validator = new Validator(reqBody,rules);

        if(validator.fails()){
            return res.status(ErrorCodes.PLAYER_NOT_FOUND_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.PLAYER_NOT_FOUND_MESSAGE });
        }

        const ApiProvider = await Providers.getProvider(reqBody.type);

        if(!ApiProvider){
            return res.status(ErrorCodes.RESOURCE_NOT_FOUND_CODE).json({ error: true, status: 'FAILED', message: 'No payment provider found!' });
        }

        return res.status(200).json()
        

    }catch(err){
        console.error(err);
        return res.status(ErrorCodes.SERVER_ERROR_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.SERVER_ERROR_MESSAGE });
    }
}

module.exports = {
    getPlans
}
