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
});

router.get('/socket_chat', function (req, res) {
  res.sendFile(path.join(__dirname + '/../views/socket_chat.html'));
});

router.get('/group_chat', function (req, res) {
  res.sendFile(path.join(__dirname + '/../views/group_chat.html'));
});

router.post('/get_login', UserMasterController.getLoginToken);


const AuthUser = require('../middleware/AuthUser');
// router.use(AuthUser);
router.get('/check', UserMasterController.check);

module.exports = router;
