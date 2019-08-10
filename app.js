'use strict';

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('dotenv').config();
var routes = require('./routes/index');
var users = require('./routes/users');
var cors = require('cors');

var Plans = require('./mongoose/index').models.Plans;
var mongoDb = require('./mongoose/index').connectionObj;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(cors);

app.use(cors({
    origin: '*',
    credentials: true
  }));
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

const GameController = require('./controllers/GameController');
let io = require('socket.io')();
app.io = io;
global.io = io;
// let schedular = require('node-schedule');
global.schedulledJobs = [];
global.io.on('connection',function(socket){
    console.log('conn establish');

    socket.on('joinRoom',function(data){
        console.log('room joined success');
        socket.join(data.teamId);
        GameController.scheduleQuestion(data);
    });

    socket.on('requestToPlay',function(request){
        if(request.hasOwnProperty('contact_number') && request.hasOwnProperty('quiz_id')){
            request.socket_id = socket.id;
            GameController.requestToPlay(request);
        }else{
            let err = { error: true, status: 'FAILED', message: "Validation errors", "validation": 'Required Parameters Not Found!' };
            global.io.sockets.connected[socket.id].emit('showError', err);
        }
    });

    socket.on('quitGame',function(request){
        request.socket_id = socket.id;
        GameController.quitGame(request);
    });

    socket.on('disconnect',function(request){
        console.log('disconnects');
        console.log(global.io.sockets.adapter.rooms);
    });
});





module.exports = app;
