'use strict';
const EncryptLib = require('../libraries/EncryptLib');


const AuthUser = async (req,res,next) => {
    try{
        const deviceToken = req.headers['x-device-token'];
        const merchantId = req.headers['merchant_id'];

        if(!deviceToken){
            return res.status(400).json({auth:false,message:'No token provided'});
        }

        if(!merchantId){
            return res.status(400).json({auth:false,message:'Merchant id missing'});
        }

        const verifyDevice = await EncryptLib.VerifyDeviceToken(deviceToken,merchantId);

        if(!verifyDevice){
            return res.status(400).json({error:true,status:"FAILED",message: "Failed to verify device token"});
        }

        req.body['merchant_id'] = verifyDevice;

        const accessToken = req.headers['x-access-token'];
        if(!accessToken){
            return res.status(400).json({error:true,status:"FAILED",message: "Access token missing!"});
        }

        if(!req.body['contact_number']){
            return res.status(400).json({error:true,status:"FAILED",message: "Contact Number Missing!"});
        }

        const verifyAcess = await EncryptLib.VerifyAccessToken(accessToken,req.body['contact_number']);

        if(!verifyAcess){
            return res.status(400).json({error:true,status:"FAILED",message: "Invalid access token or player id!"});
        }

        req.body['player_id'] = verifyAcess;
        next();

    }catch(err){
        console.log('Error in Auth middleware ' + err);
        return res.status(400).json({error:true,status:"FAILED",message: "Exception in access token verification " + err});
    }
}

module.exports = AuthUser;