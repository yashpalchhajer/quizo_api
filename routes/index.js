'use strict';

var express = require('express');
var router = express.Router();


const MerchanController = require('../controllers').MerchantController;
const PlayerController = require('../controllers').PlayerController;
// const GamePlayer = require('../controllers/GameController');
const DashBoard = require('../controllers').DashBoardController;
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

// router.post('/requestToPlay',GamePlayer.requestToPlay);


module.exports = router;
