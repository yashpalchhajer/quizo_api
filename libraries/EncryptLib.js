'use strict';

const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const MerchantMaster = require('../models').qa_merchant_masters;
const Player = require('../models').qa_players;


const getAccessToken = (player) => {
    return new Promise((resolve,reject) => {
        let token = jwt.sign(
            {
                player_id:player.id,
                contact:player.contact_number
            },player.contact_number,{
            expiresIn: 86400
        });

        resolve(token);
    });
}

const VerifyDeviceToken = (token,merchantId) => {
    return new Promise((resolve,reject) => {
        MerchantMaster.findOne({
            where:{id:merchantId,status:'ACTIVE'}
        }).then(merchant => {
            jwt.verify(token,merchant.api_key,(err,decoded) => {
                if(err){
                    reject(err);
                }
                resolve(decoded.merchantId);
            });
        }).catch(error => {
            reject(error);
        })

    })
}

const VerifyAccessToken = (token,contact_number) => {
    return new Promise((resolve,reject) => {
        Player.findOne({
            where:{
                contact_number:contact_number,
                status:'ACTIVE',
                is_otp_verified:'YES'
            }
        }).then(player => {

            if(!player){
                reject('Player is not registered or OTP is not verified!');
            }

            jwt.verify(token,player.contact_number,(err,decoded) => {
                if(err){
                    reject(err);
                }
                resolve(player);
            });
        }).catch(error => {
            reject(error);
        })
    })
}



module.exports = {
    getAccessToken,
    VerifyDeviceToken,
    VerifyAccessToken
}