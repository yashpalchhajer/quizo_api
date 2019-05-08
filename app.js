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

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
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

let GameController = require('./controllers/GameController');
// console.log(GameController);
let io = require('socket.io')();
app.io = io;
global.io = io;
let schedular = require('node-schedule');

global.io.on('connection',function(socket){
    console.log('conn establish');

    socket.on('joinRoom',function(roomId){
        console.log('event fired');
        socket.join(roomId);
        scheduleQuestion(roomId);
    });

    socket.on('requestToPlay',function(request){
        if(request.hasOwnProperty('contact_number')){
            request.socket_id = socket.id;
            GameController.requestToPlay(request);
        }
    });

});


global.io.on('disconnect',function(socket){
    console.log(socket);
});

let questions = require('./question');

function scheduleQuestion(roomId){
    let counter = 0;
  
    let startTime = new Date(Date.now());
    let endTime = new Date(startTime.getTime() + 180000);
    schedular.scheduleJob({ start: startTime, end: endTime,rule: '0-59/30 * * * * *' }, function(data){
      counter++;
      global.io.sockets.in(roomId).emit('fireQuest',questions[Math.floor(Math.random()*questions.length)]);
    });
  }

module.exports = app;
