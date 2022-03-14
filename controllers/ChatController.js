'use strict';

const Validator = require('validatorjs');

const ErrorCode = require('../config/ErrorCode');
const Utilities = require('../libraries/Utilities');
const UserChatHandler = require('../libraries/UserChatHandler');
const UserMessageThread = require('../models').user_message_thread;
const UserChatMessage = require('../models').user_chat_message;

const joinChat = async (req) => {

    let reqBody = req;

    if(!reqBody.hasOwnProperty('userId')){
        return false;
    }
    
    let conns = await Utilities.checkUserConnected(reqBody.userId);
    

    if(conns !== null){
        global.socketUsers[conns].conn.push(reqBody.socket_id);
        global.socketUsers[conns].conn = Array.from(new Set(global.socketUsers[conns].conn));
        
    }else{
        global.socketUsers.push({
            userId: reqBody.userId,
            conn: [reqBody.socket_id]
        });
    }

    console.log(global.socketUsers);

}


const handleMessage = async (req) => {

    const rules = {
        'to': 'required',
        'from': 'required',
        'message':  'required'
    };

    let validator = new Validator(req, rules);
    
    if(validator.fails()){
        let err = { error: true, status: 'FAILED', message: "Validation errors", "validation": validator.errors };
        console.log(err);
        // global.io.sockets.connected[reqBody.socket_id].emit('showError', err);
        return false;
    }

    // logic to check chat eligibility
    let isEglgible = await UserChatHandler.isEligibleForChat(req.from, req.to);
    if(!isEglgible){
        let err = { error: true, status: 'FAILED', message: "User is not eligible to chat", "validation": [] };
        console.log(err);
        // global.io.sockets.connected[reqBody.socket_id].emit('showError', err);
        return false;
    }
    console.log("get thread id");
    // get thread ID
    let threadData  = {
        'sender_id' : req.from,
        'recipient_id' : req.to,
        'status' : '1'
    }

    let threadId = await UserMessageThread.getThreadId(threadData);

    let msgData = {
        'sender_id' : req.from, 
        'recipient_id' : req.to, 
        'chat_meaasge' : req.message, 
        'message_thread_id' : threadId.thread_id
    };

    let sentMsg = await UserChatMessage.insertMessage(msgData);

    let messageData = sentMsg.dataValues;

    let senderPos = await Utilities.checkUserConnected(messageData.sender_id);
    let receiverPos = await Utilities.checkUserConnected(messageData.recipient_id);

    let senderConnections = [];
    let receiverConnection = [];

    if(senderPos != null){
        senderConnections = global.socketUsers[senderPos].conn;
    }

    if(receiverPos != null){
        receiverConnection = global.socketUsers[receiverPos].conn;
    }

    let resp = {
        "command"   :  "message", 
        "to"    :  messageData.recipient_id,
        "from"  : messageData.sender_id,
        "message"   :  messageData.chat_meaasge,
        "time"  :  messageData.created_at,
        "cid"	:	req.cid,
        "name" : req.name
    };

    for(let i =0; i < senderConnections.length; i++){
        if(global.io.sockets.connected.hasOwnProperty(senderConnections[i])){
            console.log("connection found ", senderConnections[i]);
            console.log('connection',global.io.sockets.connected[senderConnections[i]]);
            global.io.sockets.connected[senderConnections[i]].emit('clientMessage', resp);
        }
    }

    return true;

}

module.exports = {
    joinChat,
    handleMessage
}
