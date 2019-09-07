
const mongoos = require('mongoose');

const mongoConfig = require('../config/config.json').mongoDb;
//const mongoUri = 'mongodb://'+mongoConfig.username + ":" + mongoConfig.password + "@" + mongoConfig.host + '/' + mongoConfig.collection;
 const mongoUri = 'mongodb://localhost/quizo_api';

mongoos.Promise = global.Promise;
mongoos.connect(mongoUri, { useNewUrlParser: true });

var db = mongoos.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Plans = require('./Plans');

const models = { Plans };

module.exports = {
    mongoos,
    models
};
