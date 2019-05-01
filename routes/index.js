'use strict';

var express = require('express');
var router = express.Router();


const MerchanController = require('../controllers').MerchantController;
const PlayerController = require('../controllers').PlayerController;
/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });  
});

router.post('/getToken', MerchanController.getDeviceToken);

const verifyDeviceToken = require('../middleware/VerifyToken');
const AuthUser = require('../middleware/AuthUser');
// router.use(verifyDeviceToken);
router.post('/merchant',AuthUser,MerchanController.list);
router.post('/register', verifyDeviceToken,PlayerController.register);
router.post('/register-otp', verifyDeviceToken,PlayerController.verifyAuthOtp);
router.post('/login', verifyDeviceToken, PlayerController.login);
router.post('/resend-otp', PlayerController.resendOTP, verifyDeviceToken);



module.exports = router;
