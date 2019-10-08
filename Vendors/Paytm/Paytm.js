'use strict';

const LibUtility = require('../../libraries/Utilities');
const PaymentMaster = require('../../models').qa_payment_masters;
const sequelize = require('../../models/index').sequelize;
const PaytmUtility = require('./PaytmUtility');

const walletDepositInitiate = async (request, provider, res) => {
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



        await PaytmUtility.getInitCheckSum(initResp, request.player, provider.credentials).then(function (check_sum) {
            let providerCredentials = JSON.parse(provider.credentials);

            res.status(200).json({
                error: false,
                status: 'SUCCESS',
                message: '',
                data: {
                    "order_id": initResp.id.toString(), // to be sent to provider
                    "reference_number": initResp.transaction_number, // to be shown to user
                    "provider_reference": '',// to be receive from provider
                    "amount": initResp.amount.toString(),
                    "cust_id": initResp.player_id.toString(),
                    "MID": providerCredentials.MID,
                    "channel_id": providerCredentials.CHANNEL_ID,
                    "industry_id": providerCredentials.INDUSTRY_TYPE_ID,
                    "website": providerCredentials.WEBSITE,
                    "callback_url": providerCredentials.CALLBACK_URL + initResp.id.toString(),
                    "check_sum": check_sum,
                    "email": request.player.email,
                    "phone_number": request.player.contact_number
                }
            });

        });

        return res;
    } catch (err) {
        await transaction.rollback();
        console.error('Error in paytm ++++++++++++++ ',err);
        return err;
    }
}

const walletUpdateStatus = async (txnData, provider) => {

    let transaction;
    try {

        const confirmHash = await PaytmUtility.verifyHash(txnData, provider.credentials);

        if (!confirmHash) {
            throw new Error("Encrypted token verification failed");
        }


        /** check for parameters for request */
        transaction = await sequelize.transaction();


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
            await txnData.update(
                {
                    status: 'SUCCESS',
                    provider_transaction_number: requeryResp.txn_number,
                    updatedAt: Date(),
                    provider_message: 'Done'
                },
                { transaction: transaction }
            );
        } else if (requeryResp.status == 'FAILED') {
            await txnData.update(
                {
                    status: 'FAILED',
                    provider_transaction_number: requeryResp.txn_number,
                    updatedAt: Date(),
                    provider_message: 'txn failed '
                },
                { transaction: transaction }
            );
        }

        await transaction.commit();

        return {
            error: false,
            msg: 'txn status',
            data: {
                status: txnData.status,
                transaction_id: txnData.id,
                provider_transaction_number: txnData.provider_transaction_number,
                reference_number: txnData.transaction_number,
                updated_at: Date()
            }
        }

    } catch (err) {
        await transaction.rollback();
        console.error('Error in txn requery = ', err);
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