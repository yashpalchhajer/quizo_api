
const Providers = require('../models').qa_api_providers;

const ErrorCodes = require('../config/ErrorCode');


const getPaymentProviders = async (req,res) => {
    
    try{
        let reqBody = req.query;

        if(!reqBody.hasOwnProperty('player_id') || reqBody.player_id == undefined ){
            return res.status(ErrorCodes.PLAYER_NOT_FOUND_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.PLAYER_NOT_FOUND_MESSAGE });
        }

        let providers = await Providers.getProviders(process.env.TYPE_PAYMENT);
        
        if(!providers){
            return res.status(ErrorCodes.SERVER_ERROR_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.SERVER_ERROR_MESSAGE });
        }

        if(providers.length <= 0){
            return res.status(ErrorCodes.PROVIDER_NOT_FOUND_CODE).json({ error: true, status: 'FAILED', message: ErrorCodes.PROVIDER_NOT_FOUND_MESSAGE });
        }

        let responseArr = {
            "error": false,
            "status": "SUCCESS",
            "data": providers
        };

        return res.status(200).json(responseArr);


    }catch(err){
        console.error(err);
        return res.status(500).json({ error: true, status: 'FAILED', message: 'Error occured on server' });
    }
}

module.exports = {
    getPaymentProviders
}