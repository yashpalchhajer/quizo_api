'use strict';

const LibUtility = require('../../libraries/Utilities');
const PaymentMaster = require('../../models').qa_payment_masters;
const sequelize = require('../../models/index').sequelize;

const RazorPay = require('razorpay');


const initiateOrder = async (request, provider, res) => {
    let transaction;
    try {

        transaction = await sequelize.transaction();

        const refNumber = await LibUtility.generateReferenceId(request.provider_id);

        let initReq = {
            transaction_number: refNumber,
            player_id: request.player_id,
            amount: request.amount,
            plan_id: request.plan_id,
            transaction_type: 'ADD',
            provider_id: request.provider_id,
            status: 'INITIATED',
            createdAt: Date(),
            updatedAt: Date()
        };

        var initResp = await PaymentMaster.create(initReq, {
            transaction: transaction
        }).then((txnData) => {
            return txnData;
        }).catch(err => {
            throw new Error(err);
        });

        await transaction.commit();


        if (!initResp) {
            throw new Error("error in initiate transaction");
        }

        const providerCredentials = JSON.parse(provider.credentials);

        var razorInstance = new RazorPay({
            key_id: providerCredentials.key_id,
            key_secret: providerCredentials.key_secret
        });

        const reqObj = {
            amount: request.amount * 100,
            currency: "INR",
            receipt: initResp.transaction_number,
            payment_capture: false,
            notes: {}
        };

        // log request object
        razorInstance.orders.create(reqObj).then(data => {
            // log response object

            if (!data.hasOwnProperty('id') || data.id == undefined && data.id == '') {
                throw new Error("Some error occured at provider end while processing payment request, Please try again.");
            }

            if (data.receipt !== initResp.transaction_number) {
                throw new Error("Provider reference number not matched, Please try again.");
            }

            if (data.status != 'created') {
                throw new Error("Status not matched, please try again");
            }

            if (data.id != '' && data.status == 'created') {

                initResp.update({
                    provider_transaction_number: data.id,
                    updatedAt: Date()
                });
                return res.status(200).json({
                    error: false,
                    status: 'SUCCESS',
                    message: '',
                    data: {
                        "order_id": initResp.id.toString(),
                        "reference_number": initResp.transaction_number,
                        "provider_reference": data.id,
                        "amount": initResp.amount,
                        "merchant_name": providerCredentials.merchant_name,
                        "key_id": providerCredentials.key_id
                    }
                });

            }

        }).catch(err => {
            let errMsg = 'Error in request';
            if (err.hasOwnProperty('error') && err.error.hasOwnProperty('description')) {
                errMsg = err.error.description;
            }
            initResp.update({
                status: 'FAILED',
                updatedAt: Date(),
                provider_message: errMsg
            });

            return res.status(500).json({
                error: true,
                status: 'FAILED',
                message: 'Transaction failed',
                data: {
                    "order_id": initResp.id.toString(),
                    "reference_number": initResp.transaction_number,
                    "provider_message": errMsg
                }
            });
        });

    } catch (err) {
        console.error('Error in razorpay ++++++++++++++ ', err);
        await transaction.rollback();
        return err;
    }
}

const requeryTxn = async (txnDetail, provider) => {

    const providerCredentials = JSON.parse(provider.credentials);
    let transaction;
    var razorInstance = new RazorPay({
        key_id: providerCredentials.key_id,
        key_secret: providerCredentials.key_secret
    });

    let returnResp = {
        error: true,
        msg: 'init resp',
        data: {
            status: txnDetail.status,
            transaction_id: txnDetail.id,
            provider_transaction_number: txnDetail.provider_transaction_number,
            reference_number: '',
            updated_at: Date()
        }
    };


    await razorInstance.orders.fetch(txnDetail.provider_transaction_number).then(async (data) => {
        /** log req res n db */

        if (!data) {
            returnResp.error = true;
            returnResp.msg = 'Response not defined';
            return false;
        }

        if (!data.hasOwnProperty("id") && data.id != txnDetail.provider_transaction_number) {
            returnResp.error = true;
            returnResp.msg = 'Order id mismatched';
            return false;
        }

        /** 
         *  #TODO
         * # amount check
         * # different status check
         * # 
         */

        if (data.hasOwnProperty('status') && data.status == 'attempted') {

            transaction = await sequelize.transaction();

            await txnDetail.update(
                {
                    status: 'SUCCESS',
                    updatedAt: Date(),
                    provider_message: 'Done'
                },
                { transaction: transaction }
            );

            transaction.commit();

            returnResp.error = false;
            returnResp.msg = 'Transactio success';
            returnResp.data.status = txnDetail.status;
            returnResp.data.transaction_id = txnDetail.id;
            returnResp.data.provider_transaction_number = txnDetail.provider_transaction_number;
            returnResp.data.reference_number = '';
            returnResp.data.updated_at = Date();
            
            return true;
        }

        


    }).catch(err => {
        console.error("Error in fetch order razor pay *** ",err);
        returnResp.error = true;
        returnResp.msg = "Error while fetching data from provider";
    })


    return returnResp;
}

module.exports = {
    initiateOrder,
    requeryTxn
}