'use strict';

const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const MerchantMaster = require('../models').qa_merchant_masters;
const UserMaster = require('../models').users;


const getAccessToken = (player) => {
    return new Promise((resolve, reject) => {
        let token = jwt.sign(
            {
                player_id: player.id,
                contact: player.contact_number
            }, player.contact_number, {
                expiresIn: 86400
            });

        resolve(token);
    });
}

const VerifyDeviceToken = (token, merchantId) => {
    return new Promise((resolve, reject) => {
        MerchantMaster.findOne({
            where: { id: merchantId, status: 'ACTIVE' }
        }).then(merchant => {
            jwt.verify(token, merchant.api_key, (err, decoded) => {
                if (err) {
                    reject(err);
                }
                resolve(decoded.merchantId);
            });
        }).catch(error => {
            reject(error);
        })

    })
}

const VerifyAccessToken = (token, userId) => {
    return new Promise((resolve, reject) => {
        UserMaster.scope('excludeCreatedAtUpdateAt').findOne({
            where: {
                id: userId
            }
        }).then(user => {

            if (!user) {
                reject('user is not registered or OTP is not verified!');
            }

            jwt.verify(token, user.password, (err, decoded) => {
                if (err) {
                    reject(err);
                }
                resolve(user.get({ plain: true }));
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