'use strict';

var express = require('express');
var router = express.Router();
const path = require('path');

/* GET users listing. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/../views/register.html'));
});

module.exports = router;
