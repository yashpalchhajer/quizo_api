'use strict';

var express = require('express');
var router = express.Router();


const MerchanController = require('../controllers').MerchantController;
const PlayerController = require('../controllers').PlayerController;
const GameController = require('../controllers').GameController;
const DashBoard = require('../controllers').DashBoardController;
// const PlansController = require('../controllers').PlansController;
const WalletController = require('../controllers').WalletController;
const ProvidersController = require('../controllers').ProvidersController;

const UserMasterController = require('../controllers').UserMasterController;
/* GET home page. */

const path = require('path');

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/../views/register.html'));
  // res.render('index', { title: 'Express' });
});

router.get('/quiz', function (req, res) {
  res.sendFile(path.join(__dirname + '/../views/quiz.html'));
  // res.render('index', { title: 'Express' });
});

router.get('/chat_test', function (req, res) {
  res.sendFile(path.join(__dirname + '/../views/chat.html'));
  // res.render('index', { title: 'Express' });
});

router.post('/get_login', UserMasterController.getLoginToken);

// router.post('/getToken', MerchanController.getDeviceToken);

// const verifyDeviceToken = require('../middleware/VerifyToken');
const AuthUser = require('../middleware/AuthUser');
// router.use(AuthUser);
router.get('/check', UserMasterController.check);



// router.post('/merchant', AuthUser, MerchanController.list);
// router.post('/register', verifyDeviceToken, PlayerController.register);
// router.post('/register-otp', verifyDeviceToken, PlayerController.verifyAuthOtp);
// router.post('/login', verifyDeviceToken, PlayerController.login);
// router.post('/resend-otp', verifyDeviceToken, PlayerController.resendOTP);
// router.post('/updatePlayer', AuthUser, PlayerController.updatePlayer);
// router.get('/quizList', verifyDeviceToken, DashBoard.quizList);

// router.get('/getDashboardData', AuthUser, DashBoard.getPlayerDashboard);

// router.post('/submitAnswer', AuthUser, GameController.submitUserAnswer);
// router.post('/requestToPlay',GamePlayer.requestToPlay);

// router.get('/getPlans', AuthUser, PlansController.getPlans);
// router.get('/getWallet', AuthUser, WalletController.getWallet);
// router.get('/getPaymentOptions', AuthUser, ProvidersController.getPaymentProviders);
// router.post('/buyCoins',AuthUser, WalletController.buyCoins);

// router.post('/requery-txn',AuthUser,WalletController.requeryTxn);

// router.post('/paytm-call-back',function(req,res){
//   console.log(req.body);
//   return res.status(200);
// });

module.exports = router;
