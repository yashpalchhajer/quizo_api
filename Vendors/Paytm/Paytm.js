'use strict';

const LibUtility = require('../../libraries/Utilities');
const PaymentMaster = require('../../models').qa_payment_masters;
const sequelize = require('../../models/index').sequelize;
const PaytmUtility = require('./PaytmUtility');

const walletDepositInitiate = async (request, provider) => {
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


        const initResp = await PaymentMaster.create(
            initReq,
            {
                transaction: transaction
            }
        )
            .then((txnData) => {
                return txnData.get({ plain: true });
            })
            .catch(err => {
                throw new Error(err);
            });


        await transaction.commit();

        if (!initResp) {
            throw new Error('Error in initiate transaction');
        }

        if (!initResp.hasOwnProperty('id') || !initResp.hasOwnProperty('transaction_number')) {
            throw new Error('Some error occured in inittate transaction');
        }



        let paytmCheckSum = await PaytmUtility.getInitCheckSum(initResp, request.player, provider.credentials);
        // call paytm Utility to get checksum
        const returnArr = {
            "transaction_id": initResp.id, // to be sent to provider
            "reference_number": initResp.transaction_number, // to be shown to user
            "provider_reference": '',// to be sent to provider
            "provider_credentials": JSON.parse(provider.credentials), // to be user for provider calling,
            "provider_checksum_data": paytmCheckSum
        };

        // check initResp
        return returnArr;
    } catch (err) {
        await transaction.rollback();
        console.error(err);
        return err;
    }
}

const walletUpdateStatus = async (request, provider) => {

    let transaction;
    try {
        const confirmHash = await PaytmUtility.verifyHash();

        if (!confirmHash) {
            throw new Error("Encrypted token verification failed");
        }


        /** check for parameters for request */
        // transaction = await sequelize.transaction();

        let txnData = PaymentMaster.findOne(
            {
                where: {
                    id: reqBody.transaction_id,
                    status: "INITIATED",
                    transaction_type: "ADD",
                    player_id: reqBody.player_id
                }
            }
        ).then((data) => {
            return data;
        }).catch(err => {
            console.error(err);
            return err;
        })

        // need to add txn manag in select till update

        let requeryResp = await PaytmUtility.checkTxnStatus(txnData, provider.credentials);

        if (!requeryResp) {
            throw new Error('Invalid response received from utility');
        }

        if (requeryResp.hasOwnProperty('error') && requeryResp.error) {
            throw new Error(requeryResp.msg);
        }

        if (!requeryResp.hasOwnProperty('status') || !requeryResp.status || requeryResp.status == undefined) {
            throw new Error('Invalid status received from provider');
        }

        if (!requeryResp.hasOwnProperty('txn_number') || requeryResp.txn_number == undefined) {
            throw new Error("Transaction number not received from provider");
        }

        if (requeryResp.status == 'SUCCESS') {
            txnData.updateAll(
                {
                    status: 'SUCCESS',
                    provider_transaction_number: requeryResp.txn_number,
                    updatedAt: Date(),
                    provider_message: 'Done'
                },
                { transaction: transaction }
            );
        } else if (requeryResp.status == 'FAILED') {
            txnData.updateAll(
                {
                    status: 'FAILED',
                    provider_transaction_number: requeryResp.txn_number,
                    updatedAt: Date(),
                    provider_message: 'txn failed '
                },
                { transaction: transaction }
            );
        }

        return {
            error: false,
            msg: 'txn status',
            data: {
                status: txnData.status,
                transaction_id: txnData.id,
                provider_transaction_number: txnData.provider_transaction_number,
                reference_number: txnData.transaction_number,
                updateed_at: Date()
            }
        }

    } catch (err) {
        await transaction.rollback();
        console.error(err);
        return {
            error: true,
            msg: err,
            data: {}
        }
    }


}

module.exports = {
    walletDepositInitiate,
    walletUpdateStatus
}