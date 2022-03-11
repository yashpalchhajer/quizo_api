'use strict';
const EncryptLib = require('../libraries/EncryptLib');


const AuthUser = async (req,res,next) => {
    try{
        const accessToken = req.headers['x-user-token'];
        const userId = req.headers['user_id'];

        if(!accessToken){
            return res.status(400).json({auth:false,message:'No token provided'});
        }

        if(!userId){
            return res.status(400).json({auth:false,message:'User id missing'});
        }

        const verifyAccess = await EncryptLib.VerifyAccessToken(accessToken, userId);

        if(!verifyAccess){
            return res.status(400).json({error:true,status:"FAILED",message: "Invalid access token or player id!"});
        }

        req.body['user_id'] = verifyAccess.id;
        req.user = verifyAccess;

        next();

    }catch(err){
        console.log('Error in Auth middleware ' + err);
        return res.status(400).json({error:true,status:"FAILED",message: "Exception in access token verification " + err});
    }
}

module.exports = AuthUser;