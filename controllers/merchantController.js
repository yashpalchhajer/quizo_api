'use strict';


const MerchantMaster = require('../models').qa_merchant_masters;

const Validator = require('validatorjs');
const ErrorCode =  require('../config/ErrorCode');
// const EncryptLib = require('../libraries/EncryptLib');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

const list = async (req,res,next) => {
    MerchantMaster.findAll()
    .then(merchant => {res.status(200).send(merchant)})
    .catch((error) => {res.status(400).send(error)});
};

const getDeviceToken = async (req,res,next) => {
    try{
        let reqBody = req.body;
        const rules = {
            id:'required|integer',
            password:'required|alpha_num',
        };

        const validation = new Validator(reqBody,rules);
        if(validation.fails()){
            res.status(ErrorCode.VALIDATION_ERROR_CODE).json(validation.errors);
        }

        MerchantMaster.findOne({
            where: {id:reqBody.id}
        })
        .then(merchant => {

            if(merchant.password == reqBody.password){
                var token = jwt.sign({merchantId:merchant.id},merchant.api_key,{
                    expiresIn: 86400
                });

                res.status(200).json({auth:true,deviceToken:token});
            }else{
                res.status(405).json('Id or password incorrect');
            }
        }).catch(error => {
            console.log(error);
            res.status(404).json('Merchant not found');
        })

    }catch(error){
        console.log("Error in get device token" + error);
        next(error);
    }
}

module.exports = {
    list,
    getDeviceToken
}