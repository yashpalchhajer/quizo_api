var express = require('express');
var router = express.Router();


const MerchanController = require('../controllers').MerchantController;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/merchant',MerchanController.list);

module.exports = router;
