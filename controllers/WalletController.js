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
const WalletMaster = require('../models').qa_wallet_masters;

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

        if (!planDetail || planDetail.length <= 0 ) {
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
        await ProviderFactory.paymentInitiate(reqBody, providerDetails, res);


    } catch (err) {
        console.error('Error in Wallet Controler ========= ', err);
        return res.status(ErrorCodes.SERVER_ERROR_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.err });
    }

}

const requeryTxn = async (req, res) => {

    try {
        let reqBody = req.body;

        const rules = {
            "order_id": "required|integer",
            "contact_number": "required"
        };

        const validation = new Validator(reqBody, rules);
        if (validation.fails()) {
            return res.status(ErrorCodes.VALIDATION_ERROR_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.VALIDATION_ERROR_MESSAGE, "validation": Validator.errors });
        }

        const txnDetails = await PaymentMaster.findOne(
            {
                where: {
                    id: reqBody.order_id,
                    status: "INITIATED",
                    transaction_type: "ADD",
                    player_id: req.player.id
                }
                
            }
        ).then((txnData) => {
            return txnData;
        }).catch(err => {
            console.error(err);
            throw new Error(err);
        });
    
        if (!txnDetails) {
            return res.status(200).json({ error: true, status: 'FAILED', message: ErrorCodes.TXN_NOT_FOUND_MESSAGE });
        }


        const providerDetails = await Providers.getProviderById(txnDetails.provider_id);

        if (!providerDetails) {
            return res.status(200).json({ error: true, status: 'FAILED', message: ErrorCodes.PROVIDER_NOT_FOUND_MESSAGE });
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

        if (!updateResp.data.hasOwnProperty('status') || updateResp.data.status == undefined) {
            return json({ error: true, status: 'FAILED', message: 'Invalid response received from provider, Please check after some time.' });
        }

        if (updateResp.data.status == 'SUCCESS') {
            // update wallet master

            /** get plan details to coins */
            let Plan = await Plans.getPlanById(txnDetails.plan_id);
            if (!Plan || Plan.length <= 0 ) {
                throw new Error("Invalid plan details");
            }
            let coinsToAdd = 0;
            Plan = Plan[0];
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
                return err;
            });

            
            let walletInfo = await Wallets.findOne(
                {
                    where: { player_id: player.id }
                }
            ).then((wallet) => {
                wallet.update(
                    {
                        purchased: parseInt(wallet.purchased) + parseInt(coinsToAdd),
                        updateAt: Date()
                    }
                );
                return wallet.get({ plain: true });
            }).catch(err => {
                console.error(err);
                throw new Error('Error in wallet update');
            });

            await transaction.commit();

            return { error: false, status: 'SUCCESS', message: 'Transaction is success', data: walletInfo };

        } else if (updateResp.status == 'FAILED') {
            return { error: true, status: 'FAILED', message: 'Transaction is Failed', data: walletInfo };
        }

    } catch (err) {
        // await transaction.rollback();
        console.error('Error in Requery = ',err);
        return { error: true, status: 'FAILED', message: err, data: {} };
    }
}


module.exports = {
    getWallet,
    buyCoins,
    requeryTxn
}