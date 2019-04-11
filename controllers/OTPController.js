'use strict';

const OTPToken = require('../models').qa_otp_tokens;

const Validator = require('validatorjs');



const generateOTP = () => {
    // code to generate OTP and return
    return new Promise((resolve,reject) => {
        resolve(Math.floor(Math.random() * Math.floor(999999)));
    })
}


module.exports = {
    generateOTP
}