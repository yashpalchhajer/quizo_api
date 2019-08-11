'use strict';

const Player = require('../models').qa_players;
const Validator = require('validatorjs');
// const OTPToken = require('../models').qa_otp_tokens;
const Wallets = require('../models').qa_wallets;
const ErrorCodes = require('../config/ErrorCode');
const Plans = require('../mongoose/Plans');


const getWallet = async (req, res) => {
    try {

        let reqBody = req.query;

        const rules = {
            "contact_number": 'required|min:10|max:10',
        }

        const validator = new Validator(reqBody, rules);
        if (validator.fails()) {
            return res.status(ErrorCodes.VALIDATION_ERROR_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.VALIDATION_ERROR_MESSAGE, "validation": validator.errors });
        }

        let playerData = await Player.checkPlayerExistance(reqBody.contact_number);

        if (!playerData) {
            return res.status(ErrorCodes.PLAYER_NOT_FOUND_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.PLAYER_NOT_FOUND_MESSAGE });
        }

        let walletDetails = await Wallets.getWalletDetails(playerData);

        let responseArr = {
            "error": false,
            "status": "SUCCESS",
            "data": {
                "free_credits": walletDetails.dataValues.free_credits,
                "referrals": walletDetails.dataValues.referrals,
                "purchased": walletDetails.dataValues.purchased,
                "earned": walletDetails.dataValues.earned,
            }
        };

        return res.status(200).json({ responseArr });

    } catch (err) {
        console.error(err);
        return res.status(ErrorCodes.SERVER_ERROR_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.SERVER_ERROR_MESSAGE });
    }
}

const buyCoins = async (req, res) => {

    /** #TO DO 
     * buy
     * check plan exstance with player mappinng
     * check payment gateway existance
     * pay for this 
     * do txn
     * update payment master
     * wallet master
     * wallet
     * 
    */
    try {

        let reqBody = req.body;

        if (req.hasOwnProperty('player') && req.player == undefined) {
            return res.status(ErrorCodes.PLAYER_NOT_FOUND_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.PLAYER_NOT_FOUND_MESSAGE });
        }

        const rules = {
            'contact_number': 'required|min:10|max:10',
            'plan_id': 'required',
            'amount': 'required|min:0|integer'
        };

        const validator = new Validator(reqBody, rules);

        if (validator.fails()) {
            return res.status(ErrorCodes.VALIDATION_ERROR_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.VALIDATION_ERROR_MESSAGE, "validation": validator.errors });
        }

        let planDetail = await Plans.getPlanById(reqBody.plan_id);

        if(!planDetail){
            return res.status(ErrorCodes.RESOURCE_NOT_FOUND_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.RESOURCE_NOT_FOUND_MESSAGE, "validation": validator.errors });
        }


        /** initiate payment */

        /** need to refactor  */



        return res.status(200).json(planDetail);




    } catch (err) {
        console.error(err);
        return res.status(ErrorCodes.SERVER_ERROR_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.SERVER_ERROR_MESSAGE });
    }




}

module.exports = {
    getWallet,
    buyCoins
}