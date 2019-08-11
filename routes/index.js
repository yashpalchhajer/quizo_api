'use strict';

var express = require('express');
var router = express.Router();


const MerchanController = require('../controllers').MerchantController;
const PlayerController = require('../controllers').PlayerController;
const GameController = require('../controllers').GameController;
const DashBoard = require('../controllers').DashBoardController;
const PlansController = require('../controllers').PlansController;
const WalletController = require('../controllers').WalletController;

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/getToken', MerchanController.getDeviceToken);

const verifyDeviceToken = require('../middleware/VerifyToken');
const AuthUser = require('../middleware/AuthUser');
// router.use(verifyDeviceToken);
router.post('/merchant', AuthUser, MerchanController.list);
router.post('/register', verifyDeviceToken, PlayerController.register);
router.post('/register-otp', verifyDeviceToken, PlayerController.verifyAuthOtp);
router.post('/login', verifyDeviceToken, PlayerController.login);
router.post('/resend-otp', verifyDeviceToken, PlayerController.resendOTP);
router.post('/updatePlayer', AuthUser, PlayerController.updatePlayer);
router.get('/quizList', verifyDeviceToken, DashBoard.quizList);

router.get('/getDashboardData', AuthUser, DashBoard.getPlayerDashboard);

router.post('/submitAnswer', AuthUser, GameController.submitUserAnswer);
// router.post('/requestToPlay',GamePlayer.requestToPlay);

router.get('/getPlans', AuthUser, PlansController.getPlans);
router.get('/getWallet', AuthUser, WalletController.getWallet);

// router.post('/buyCoins',AuthUser, WalletController.buyCoins);
router.post('/buyCoins',AuthUser, (req,res) => {
  return res.status(200).json({error:false,message:'Under development'});
});

module.exports = router;
