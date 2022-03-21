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

var app = express();

app.use(express.static('public'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(cors);
app.set('views', './views');

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

const ChatController = require('./controllers/ChatController');
let io = require('socket.io')();
app.io = io;
global.io = io;

global.socketUsers = [];


global.schedulledJobs = [];
global.io.on('connection',function(socket){

    socket.on('register', function(request){
        socket.join(request.userId);
        // verify auth
        request.socket_id = socket.id;

        ChatController.joinChat(request);

    });

    /**
     * user_id
     * message
     * event_id
     * 
     */
    socket.on('groupChat', function(request){
        request.socket_id = socket.id;
        if(request.type === 'EVENT'){
            ChatController.handleEventChat(request);
        }else if(request.type === 'TRIBE'){
            ChatController.handleTribeChat(request);
        }
    });


    /**
     * from
     * to
     * message
     * cid
     * name
     * 
     */
    socket.on('message', function(request){
        request.socket_id = socket.id;
        ChatController.handleMessage(request);
    })


    socket.on('disconnect',function(request){
        console.log('disconnects');
        // remove form user socket
        console.log(global.io.sockets.adapter.rooms);
    });
});





module.exports = app;
