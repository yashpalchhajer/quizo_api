'use strict';

const Player = require('../models').qa_players;
const Validator = require('validatorjs');
// const OTPToken = require('../models').qa_otp_tokens;
const Wallets = require('../models').qa_wallets;
const ErrorCodes = require('../config/ErrorCode');
const Plans = require('../mongoose/Plans');
const Providers = require('../models').qa_api_providers;
const ProviderFactory = require('../libraries/ProviderFactory');
const PaymentMaster = require('../models').qa_payment_masters;
const sequelize = require('../models/index').sequelize;

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

    try {

        let reqBody = req.body;

        if (req.hasOwnProperty('player_id') && req.player_id == undefined) {
            return res.status(ErrorCodes.PLAYER_NOT_FOUND_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.PLAYER_NOT_FOUND_MESSAGE });
        }

        const rules = {
            'contact_number': 'required|min:10|max:10',
            'plan_id': 'required',
            'amount': 'required|min:0|integer',
            'provider_id': 'required'
        };

        const validator = new Validator(reqBody, rules);

        if (validator.fails()) {
            return res.status(ErrorCodes.VALIDATION_ERROR_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.VALIDATION_ERROR_MESSAGE, "validation": validator.errors });
        }

        let planDetail = await Plans.getPlanById(reqBody.plan_id);

        if (!planDetail) {
            return res.status(ErrorCodes.RESOURCE_NOT_FOUND_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.RESOURCE_NOT_FOUND_MESSAGE, });
        }

        /** check amount */

        let providerDetails = await Providers.getProviderById(reqBody.provider_id);

        if (!providerDetails) {
            return res.status(ErrorCodes.PROVIDER_NOT_FOUND_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.PROVIDER_NOT_FOUND_MESSAGE });
        }

        let initiateResp;
        /** initiate payment */
        reqBody['player'] = req.player;
        // initiateResp = await ProviderFactory.paymentInitiate(reqBody, providerDetails,res);
        await ProviderFactory.paymentInitiate(reqBody,providerDetails,res);
        

    } catch (err) {
        console.error('Error in Wallet Controler ========= ',err);
        return res.status(ErrorCodes.SERVER_ERROR_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.err });
    }

}

const processPayment = async (req, res) => {

    try {
        let reqBody = req.body;

        const rules = {
            "transaction_id": "required",
            "player_id": "required",
            "provider_id": "required",
            "response": "required"
        };

        const validation = new Validator(reqBody, rules);
        if (validation.fails()) {
            return res.status(ErrorCodes.VALIDATION_ERROR_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.VALIDATION_ERROR_MESSAGE, "validation": validator.errors });
        }

        const txnDetails = await PaymentMaster.findOne(
            {
                where: {
                    id: reqBody.transaction_id,
                    status: "INITIATED",
                    transaction_type: "ADD",
                    player_id: reqBody.player_id
                },
                raw: true
            }
        ).then((txnData) => {
            return txnData;
        }).catch(err => {
            console.error(err);
            throw new Error(err);
        });

        if (!txnDetails) {
            return res.status(ErrorCodes.TXN_NOT_FOUND_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.TXN_NOT_FOUND_MESSAGE });
        }

        if (txnDetails.DataValues.provider_id != reqBody.provider_id) {
            return res.status(ErrorCodes.INVALID_PROVIDER_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.INVALID_PROVIDER_MESSAGE });
        }

        const providerDetails = await Providers.getProviderById(reqBody.provider_id);

        if (!providerDetails) {
            return res.status(ErrorCodes.PROVIDER_NOT_FOUND_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.PROVIDER_NOT_FOUND_MESSAGE });
        }

        const requery = await doRequery(req.player, txnDetails, providerDetails);

        return res.status(200).json(requery);

    } catch (err) {
        console.error(err);
        return res.status(ErrorCodes.SERVER_ERROR_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.err });
    }

}

const doRequery = async (player, txnDetails, provider) => {
    let transaction;
    try {
        let updateResp;

        updateResp = await ProviderFactory.updatePaymentStatus(txnDetails, provider);

        if (!updateResp) {
            if (updateResp.hasOwnProperty('msg') || updateResp.msg != undefined) {
                return json({ error: true, status: 'FAILED', message: ErrorCodes.updateResp.msg });
            } else {
                return json({ error: true, status: 'FAILED', message: ErrorCodes.SERVER_ERROR_MESSAGE });
            }
        }

        if (!updateResp.hasOwnProperty('status') || updateResp.status == undefined) {
            return json({ error: true, status: 'FAILED', message: 'Invalid response received from provider, Please check after some time.' });
        }

        if (updateResp.status == 'SUCCESS') {
            // update wallet master

            /** get plan details to coins */
            const Plan = Plans.getPlanById(txnDetails.plan_id);

            if (!Plan) {
                throw new Error("Invalid plan details");
            }
            let coinsToAdd = 0;

            if (Plan.plan_type == 'DEFAULT') {
                coinsToAdd = Number(Plan.coin_per_rupie) * Number(txnDetails.amount);
            } else {
                coinsToAdd = Plan.coin_per_rupie;
            }

            transaction = await sequelize.transaction();

            await WalletMaster.create(
                {
                    player_id: player.id,
                    type: 'ADD',
                    coins: coinsToAdd,
                    payment_ref_id: txnDetails.id,
                    createdAt: Date(),
                    updateAt: Date()
                },
                {
                    transaction: transaction
                }
            ).then(data => {
                return data.get({ plain: true });
            }).catch(err => {
                console.error(err);
                return err;
            });
            // update wallet balance

            let walletInfo = await Wallets.findOne(
                {
                    where: { player_id: player.id }
                }
            ).then((wallet) => {
                    wallet.update(
                        {
                            purchased: parseInt(wallet.purchased) + parseInt(coinsToAdd),
                            updateAt : Date()
                        }
                    );
                    return wallet.get({plain:true});
            }).catch(err => {
                console.error(err);
                throw new Error('Error in wallet update');
            });

            await transaction.commit();

            return json({ error: false, status: 'SUCCESS', message: 'Transaction is success',data: walletInfo });

        } else if (updateResp.status == 'FAILED') {
            return json({ error: true, status: 'FAILED', message: 'Transaction is Failed',data: walletInfo });
        }

    } catch (err) {
        await transaction.rolback();
        console.error(err);
        return json({ error: true, status: 'FAILED', message: err,data: {} });
    }
}


module.exports = {
    getWallet,
    buyCoins
}