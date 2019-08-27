
const Paytm = require('../Vendors/Paytm/Paytm');

const paymentInitiate = async (request, provider) => {

    let paymentInitiateResp = '';

    switch (provider.id) {
        case 1:
            paymentInitiateResp = await Paytm.walletDepositInitiate(request, provider);
            break;

        case 2:

            break;

        default:

            break;
    }

    // check paymentInitiateResp

    return paymentInitiateResp;
}

const updatePaymentStatus = async (request, provider) => {

    let providerResp = '';

    switch (provider.id) {
        case 1:
            providerResp = await Paytm.walletUpdateStatus(request, provider);
            break;

        case 2:

            break;

        default:

            break;
    }

    return providerResp;

}

module.exports = {
    paymentInitiate,
    updatePaymentStatus
}