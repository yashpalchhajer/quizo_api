'use strict';


const MerchantMaster = require('../models').qa_merchant_masters;

const Validator = require('validatorjs');
const ErrorCode = require('../config/ErrorCode');
// const EncryptLib = require('../libraries/EncryptLib');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

const list = async (req, res, next) => {
    MerchantMaster.findAll()
        .then(merchant => {
            let responseArr = {
                "error": false,
                "status":"SUCCESS",
                "data": merchant
            }

            return res.status(200).send(responseArr);
        })
        .catch((error) => {
            return res.status(400).json({ error: true, status: 'FAILED', message: "Error while getting info", });
        });
};

const getDeviceToken = async (req, res, next) => {
    try {
        let reqBody = req.body;
        const rules = {
            id: 'required|integer',
            password: 'required|alpha_num',
        };

        const validation = new Validator(reqBody, rules);
        if (validation.fails()) {
            return res.status(400).json({ error: true, status: 'FAILED', message: "Validation errors", "validation": validation.errors });
        }

        MerchantMaster.findOne({
            where: { id: reqBody.id,status:'ACTIVE' }
        })
            .then(merchant => {

                if(!merchant){
                    return res.status(500).json({ error: true, status: 'FAILED', message: 'Merchant is temporarily down, Please try after some time.' });
                }

                if (merchant.password == reqBody.password) {
                    var token = jwt.sign({ merchantId: merchant.id }, merchant.api_key, {
                        expiresIn: 86400
                    });

                    let responseArr = {
                        "error": false,
                        "status":"SUCCESS",
                        "data": {"token":token}
                    };
                    return res.status(200).json(responseArr);
                } else {
                    return res.status(500).json({ error: true, status: 'FAILED', message: 'Incorrect ID or Password' });
                }
            }).catch(error => {
                return res.status(500).json({ error: true, status: 'FAILED', message: 'Some error occured while getting token. [001]' });
            })

    } catch (error) {
        return res.status(500).json({ error: true, status: 'FAILED', message: 'Some error occured while getting token. [002]' });
    }
}

module.exports = {
    list,
    getDeviceToken
}