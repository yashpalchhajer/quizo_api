const Player = require('../models').qa_players;
const Validator = require('validatorjs');
const OTPToken = require('../models').qa_otp_tokens;
const EncryptLib = require('../libraries/EncryptLib');
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {mixed} {error:boolean,status:TEXT,message:TEXT,data:{},validation:{}} 
 */

const register = async (req, res) => {
    try {
        let reqBody = req.body;

        const rules = {
            name: 'required|string',
            contact_number: 'required|min:10|max:10',
            email: 'email',
            gender: 'in:F,M,T',
        }

        const validator = new Validator(reqBody, rules);
        if (validator.fails()) {
            res.status(400).json({ error: true, status: 'FAILED', message: "Validation errors", "validation": validator.errors });
        }

        let playerData = await Player.checkPlayerExistance(reqBody.contact_number);
        let isRegistered = true;
        let respMessage = "Please enter OTP sent on " + reqBody.contact_number.substr(0, 3) + "****" + reqBody.contact_number.substr(7, 10) + " to continue.";

        if (!playerData) {
            isRegistered = false;
            playerData = await Player.register(reqBody);
            respMessage = "You successfuly registered on Quizo. Please enter OTP sent on " + reqBody.contact_number.substr(0, 3) + "****" + reqBody.contact_number.substr(7, 10);
        }

        let otp = await OTPToken.generateOTP(playerData, process.env.ACTION_REGISTER);

        if (!otp) {
            res.status(400).json({ "error": "Error in OTP generation" });
        }

        if(process.env.NODE_ENV == 'development'){
            respMessage = respMessage + " [" + otp + "]";
        }

        let responseArr = {
            "error": false,
            "success": "SUCCESS",
            "data": {
                "isRegistered": isRegistered,
                "message": respMessage,
                "action": process.env.ACTION_REGISTER
            }
        };

        res.status(200).json(responseArr);
        /** if user not exists then register and send otp */

    } catch (error) {
        res.status(500).json({ error: true, status: 'FAILED', message: 'Error occured while registering' });
    }
}

const verifyAuthOtp = async (req, res) => {
    try {
        let reqBody = req.body;
        const rules = {
            "contact_number": 'required|min:10|max:10',
            "otp": 'required|min:6|max:10',
            "action": "required|numeric"
        }

        const validator = new Validator(reqBody, rules);

        if (validator.fails()) {
            res.status(400).json({ error: true, status: 'FAILED', message: "Validation errors", "validation": validator.errors });
        }

        let playerData = await Player.checkPlayerExistance(reqBody.contact_number);

        if (!playerData) {
            res.status(400).json({ error: true, status: 'FAILED', message: "No player found with this mobile number" });
        }

        reqBody['player_id'] = playerData.id;
        const otpData = await OTPToken.checkOTP(reqBody);

        if (!otpData) {
            res.status(401).json({ error: true, status: 'FAILED', message: "OTP you have entered wrong OTP" });
        }

        otpData.update({ is_valid: false });


        /** get date dfference 
         * NEED TO ADD IN LIBRARY
        */
        const generateTime = otpData.createdAt;
        const current = new Date();
        const diffMs = (current - generateTime); // milliseconds between now & Christmas
        const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

        if (diffMins > process.env.OTP_EXP_LIMIT) {
            res.status(500).json({ error: true, status: 'FAILED', message: 'Your OTP has been expired!' });
        }

        let accesToken = await EncryptLib.getAccessToken(playerData);

        let responseArr = {
            "error": false,
            "success": "SUCCESS",
            "data": {
                "player": {
                    "name": playerData.name,
                    "email": playerData.email,
                    "contact_number": playerData.contact_number,
                    "gender": playerData.gender,
                    "profile_img": playerData.profile_img_url,
                },
                "accessToken": accesToken
            }
        };

        res.status(200).json({ responseArr });
    } catch (err) {
        res.status(500).json({ error: true, status: 'FAILED', message: 'Error occured while verifying OTP' });
    }

}

const login = async (req, res) => {
    try {
        let reqBody = req.body;
        const rules = {
            "contact_number": 'required|min:10|max:10'
        };

        const validator = new Validator(reqBody, rules);

        if (validator.fails()) {
            res.status(400).json({ error: true, status: 'FAILED', message: "Validation errors", "validation": validator.errors });
        }

        let playerData = await Player.checkPlayerExistance(reqBody.contact_number);

        if (!playerData) {
            res.status(400).json({ error: true, status: 'FAILED', isRegistered: false, message: "No user found with given mobile number!", });
        }

        let otp = await OTPToken.generateOTP(playerData, process.env.ACTION_LOGIN);

        if (!otp) {
            res.status(400).json({ "error": "Error in OTP generation" });
        }

        let respMessage = "Please enter OTP sent on " + reqBody.contact_number.substr(0, 3) + "****" + reqBody.contact_number.substr(7, 10) + " to continue.";

        if(process.env.NODE_ENV == 'development'){
            respMessage = respMessage + " [" + otp + "]";
        }

        let responseArr = {
            "error": false,
            "success": "SUCCESS",
            "data": {
                "isRegistered": true,
                "message": respMessage,
                "action": process.env.ACTION_LOGIN
            }
        };

        res.status(200).json(responseArr);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, status: 'FAILED', message: 'Error occured while registering' });
    }
}

const resendOTP = async (req, res) => {
    try {
        let reqBody = req.body;
        const rules = {
            "contact_number": 'required|min:10|max:10',
            "action": "required|numeric"
        }

        const validator = new Validator(reqBody, rules);

        if (validator.fails()) {
            res.status(400).json({ error: true, status: 'FAILED', message: "Validation errors", "validation": validator.errors });
        }

        let playerData = await Player.checkPlayerExistance(reqBody.contact_number);

        if (!playerData) {
            res.status(400).json({ error: true, status: 'FAILED', message: "No player found with this mobile number" });
        }

        reqBody['player_id'] = playerData.id;
        const otpData = await OTPToken.checkOTP(reqBody,true);
        
        if (!otpData) {
            res.status(401).json({ error: true, status: 'FAILED', message: "OTP you have entered wrong OTP" });
        }

        otpData.update({ is_valid: false });

        let retryAvailable = otpData.retry_available;

        /** get date dfference 
         * NEED TO ADD IN LIBRARY
        */
        const generateTime = otpData.createdAt;
        const current = new Date();
        const diffMs = (current - generateTime); // milliseconds between now & Christmas
        const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        
        if (retryAvailable <= 0 && diffMins <= 60) {
            res.status(401).json({ error: true, status: 'FAILED', message: "You have reached max retry. please try after few hours" });
        }

        let otp = await OTPToken.resendOTP(playerData, reqBody.action,retryAvailable - 1);

        if (!otp) {
            res.status(400).json({ "error": "Error in OTP generation" });
        }

        let respMessage = "Please enter OTP sent on " + reqBody.contact_number.substr(0, 3) + "****" + reqBody.contact_number.substr(7, 10) + " to continue.";

        if(process.env.NODE_ENV == 'development'){
            respMessage = respMessage + " [" + otp + "]";
        }

        let responseArr = {
            "error": false,
            "success": "SUCCESS",
            "data": {
                "message": respMessage,
                "action": reqBody.action
            }
        };

        res.status(200).json(responseArr);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, status: 'FAILED', message: 'Error occured while registering' });
    }
}

module.exports = {
    register,
    verifyAuthOtp,
    login,
    resendOTP
}