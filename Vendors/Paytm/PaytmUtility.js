'use strict';

const Http = require('https');
var paytm_checksum = require('./paytm/checksum');
const jwt = require('jsonwebtoken');

// call paytm http request
const getInitCheckSum = async (txnDetails, player, providerCredentials) => {

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
        paramarray['CALLBACK_URL'] = providerCredentials.WEBSITE;//Provided by Paytm
        paramarray['EMAIL'] = player.email; // customer email id
        paramarray['MOBILE_NO'] = player.contact_number; // customer 10 digit mobile no.

        let check = paytm_checksum.genchecksum(paramarray, MERCHANT_KEY, function(err, checksum) {
            console.log('Checksum: ', checksum, "\n");
            if (err) throw new Error(err);
            return checksum;
        });

        console.log('check = ',check);

        return check;
    } catch (err) {
        console.error('Error = ',err);
    }


    // init response log

    return checkSum;
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

