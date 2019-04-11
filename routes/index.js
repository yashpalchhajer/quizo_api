var express = require('express');
var router = express.Router();


const MerchanController = require('../controllers').MerchantController;
const PlayerController = require('../controllers').PlayerController;
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/getToken',MerchanController.getDeviceToken);

const verifyDeviceToken = require('../middleware/VerifyToken');

router.use(verifyDeviceToken);
router.get('/merchant',MerchanController.list);
router.post('/register',PlayerController.register);
router.post('/register-otp',PlayerController.verifyAuthOtp);
router.post('/login',PlayerController.login);
router.post('/resend-otp',PlayerController.resendOTP);

module.exports = router;
