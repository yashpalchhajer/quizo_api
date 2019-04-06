'use strict';


const MerchantMaster = require('../models').qa_merchant_masters;

module.exports = {
    list(req,res){
        console.log(MerchantMaster);
        MerchantMaster.findAll()
        .then(merchant => {res.status(200).send(merchant)})
        .catch((error) => {res.status(400).send(error)});
    }
}