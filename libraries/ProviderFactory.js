
const Paytm = require('../Vendors/Paytm/Paytm');
const Razorpay = require('../Vendors/Razorpay/Razorpay');

const paymentInitiate = (request, provider,res) => {

    let paymentInitiateResp = '';

    switch (provider.id) {
        case 1:
        Paytm.walletDepositInitiate(request, provider,res);
            break;

        case 2:
        Razorpay.initiateOrder(request,provider,res);
            break;

        default:

            break;
    }

    // check paymentInitiateResp

    // return paymentInitiateResp;
}

const updatePaymentStatus = async (request, provider) => {

    let providerResp = '';

    switch (provider.id) {
        case 1:
            providerResp = await Paytm.walletUpdateStatus(request, provider);
            break;

        case 2:
            providerResp = await Razorpay.order(request,provider);
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