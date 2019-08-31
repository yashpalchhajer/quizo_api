'use strict';

const Http = require('https');
var paytm_checksum = require('./paytm/checksum');
const ErrorCode = require('../../config/ErrorCode');
// call paytm http request
const getInitCheckSum = (txnDetails, player, providerCredentials,res) => {
    try {
        providerCredentials = JSON.parse(providerCredentials);
        // init request log
        var MERCHANT_KEY = providerCredentials.MERCHANT_KEY;
        var paramarray = {};
        paramarray['MID'] = providerCredentials.MID; //Provided by Paytm
        paramarray['ORDER_ID'] = txnDetails.id + ""; //unique OrderId for every request
        paramarray['CUST_ID'] = txnDetails.player_id + "";  // unique customer identifier 
        paramarray['INDUSTRY_TYPE_ID'] = providerCredentials.INDUSTRY_TYPE_ID; //Provided by Paytm
        paramarray['CHANNEL_ID'] = providerCredentials.CHANNEL_ID; //Provided by Paytm
        paramarray['TXN_AMOUNT'] = txnDetails.amount + ""; // transaction amount
        paramarray['WEBSITE'] = providerCredentials.WEBSITE; //Provided by Paytm
        paramarray['CALLBACK_URL'] = providerCredentials.CALLBACK_URL; //Created by app
        paramarray['EMAIL'] = player.email; // customer email id
        paramarray['MOBILE_NO'] = player.contact_number; // customer 10 digit mobile no.
        paytm_checksum.genchecksum(paramarray, MERCHANT_KEY, function(err, checksum) {

            if (err) {
                res.status(ErrorCode.INIT_TXN_ERROR).json({
                    error: true,
                    status: 'FAILED',
                    message: INIT_TXN_ERROR_MSG,
                    data:[]
                });
            }

            res.status(200).json({error: false, status: 'SUCCESS', message: '',data:{
                "order_id": txnDetails.id, // to be sent to provider
                "reference_number": txnDetails.transaction_number, // to be shown to user
                "provider_reference": '',// to be receive from provider
                "amount":txnDetails.amount,
                "cust_id":txnDetails.player_id,
                "MID":providerCredentials.MID,
                "channel_id":providerCredentials.CHANNEL_ID,
                "industry_id":providerCredentials.INDUSTRY_TYPE_ID,
                "website":providerCredentials.WEBSITE,
                "callback_url": providerCredentials.CALLBACK_URL,
                "check_sum": checksum,
                "phone_number" : player.contact_number
                }
            });

        });
        // console.log('check = ',check);
    } catch (err) {
        console.error('Error in Paytm Utility ****************** ',err);

        res.status(ErrorCode.INIT_TXN_ERROR).json({
            error: true,
            status: 'FAILED',
            message: ErrorCode.INIT_TXN_ERROR_MSG,
            data:{
                "order_id":txnDetails.id,
                "reference_number":txnDetails.transaction_number,
                "status":txnDetails.status
            }
        });
    }finally{
        // console.log('paytm utility finally ///////////////////// ' , res.status);
        return res;
    }
}

const verifyHash = async (payload, providerCredentials) => {

    // verify hash algo

    return true;
}

const checkTxnStatus = async (request, providerCredentials) => {

    try {
        providerCredentials = JSON.parse(providerCredentials);

        var baseUrl = providerCredentials.baseUrl;
        var requeryUrl = baseUrl.providerCredentials.requeryUrl;

        var params = {};
        params['order_id'] = request.id;

        const httpResp = await HttpCall(requeryUrl, 'POST', params);

        if (!httpResp) {
            throw new Error("Blank response received from provider");
        }

        // check response params

        return {
            error: false,
            msg: '',
            data: {
                "status": "SUCCESS",
                "txn_number": "ABC" + rand(999, 9999) + "TEST"
            }
        };
    } catch (err) {
        console.error(err);
        return {
            error: true,
            msg: err
        };
    }


}

const HttpCall = async (url, method = 'POST', data = {}, headers = [], timeout = 20) => {




}

module.exports = {
    getInitCheckSum,
    verifyHash,
    checkTxnStatus
}

