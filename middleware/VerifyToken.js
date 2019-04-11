const jwt = require('jsonwebtoken');

const MerchantMaster = require('../models').qa_merchant_masters;

const verifyDeviceToken = (req,res,next) => {
    try{

        req.body['merchant_id'] = 1;
        next();

/*         const token = req.headers['x-access-token'];
        const merchantId = req.headers['merchant_id'];

        if(!token){
            return res.status(400).json({auth:false,message:'No token provided'});
        }

        if(!merchantId){
            return res.status(400).json({auth:false,message:'Merchant id missing'});
        }

        MerchantMaster.findOne({
            where:{id:merchantId,status:'ACTIVE'}
        }).then(merchant => {
            jwt.verify(token,merchant.api_key,(err,decoded) => {
                if(err){
                    return res.status(401).json({auth:false,message:'Failed to verify token'});
                }
                req.body['merchant_id'] = decoded.merchantId;
                next();
            });
        }).catch(error => {
            res.status(400).json({auth:false,message:'Invalid merchant id'});
        }) */

    }catch(error){
        console.log('Error in middleware ' + error);
        next(error);
    }
}

module.exports = verifyDeviceToken;
