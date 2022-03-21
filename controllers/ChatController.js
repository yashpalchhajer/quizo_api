'use strict';

const Validator = require('validatorjs');

const ErrorCode = require('../config/ErrorCode');
const Utilities = require('../libraries/Utilities');
const UserChatHandler = require('../libraries/UserChatHandler');
const UserMessageThread = require('../models').user_message_thread;
const UserChatMessage = require('../models').user_chat_message;
const EventJoinedUser = require('../models').event_joined_users;
const GroupChat = require('../models').group_chat;
const TribeJoinedUser = require('../models').tribe_joined_users;
const TribeGroupChat = require('../models').tribe_group_chat;
const UserInfo = require('../models').userinfo;

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
        global.io.to(req.socket_id).emit('showError', err);
        return false;
    }

    // logic to check chat eligibility
    let isEglgible = await UserChatHandler.isEligibleForChat(req.from, req.to);
    if(!isEglgible){
        let err = { error: true, status: 'FAILED', message: "User is not eligible to chat", "validation": [] };
        global.io.to(req.socket_id).emit('showError', err);
        return false;
    }

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

    senderConnections = senderConnections.concat(receiverConnection);

    try{
        for(let i = 0; i < senderConnections.length; i++){
            if(global.io.to(senderConnections[i]) != undefined){
                global.io.to(senderConnections[i]).emit('clientMessage', resp);
            }
        }
    }catch(err){
        console.error(err);
    }

    return true;

}


const handleEventChat = async (req) =>  {
    try{

        const rules = {
            'user_id'   :   'required',
            'channel_id'  :   'required',
            'message'   :   'required'
        };

        let validator = new Validator(req, rules);

        if(validator.fails()){
            let err = { error: true, status: 'FAILED', message: "Validation errors", "validation": validator.errors };
            console.log(err);
            global.io.to(req.socket_id).emit('showError', err);
            return false;
        }

        let isJoined = await EventJoinedUser.getJoinedId(req.user_id, req.channel_id);

        if(!isJoined){
            let err = { error: true, status: 'FAILED', message: "User is not a member of this event" };
            global.io.to(req.socket_id).emit('showError', err);
            return false;
        }

        let msgData = {
            'user_id'   :  req.user_id,
            'event_info_id'  :  req.channel_id,
		    'message'   :  req.message,
        };
        let chatData = await GroupChat.createMessage(msgData);

        if(!chatData){
            let err = { error: true, status: 'FAILED', message: "Cannot send message to event " };
            global.io.to(req.socket_id).emit('showError', err);
            return false;
        }

        let senderDetails = await UserInfo.getUser(req.user_id);
        
        let eventUsers = await EventJoinedUser.eventUsers(req.channel_id);

        let usersList = eventUsers.map( users => users.user_id);
        usersList = Array.from( new Set(usersList));

        let senderProfile =  `${process.env.MAIN_DOMAIN_URL}public/uploads/users/default_user.png`;
        let senderFullName = "";
        if(senderDetails !=null ){
            if(senderDetails.profile_img != null && senderDetails.profile_img != ""){
                senderProfile =  `${process.env.MAIN_DOMAIN_URL}public/uploads/users/${senderDetails.profile_img}`;
            }

            if(senderDetails.first_name != null){
                senderFullName = senderDetails.first_name;
            }

            if(senderDetails.last_name != null){
                senderFullName = `${senderFullName} ${senderDetails.last_name}`;
            }

        }

        // send message to all
        let allSendConn = await Utilities.getMultiConnections(usersList);
        
        let resp = {
            "type"  :  "EVENT",
            "to"    :  req.channel_id,
            "from"  : req.user_id,
            "message"   :  req.message,
            "time"  :  "",
            "sender_name"  :  senderFullName,
            "sender_profile"  :  senderProfile,
            "cid"	:	req.cid
        };

        // send to each socket
        try{
            for(let i = 0; i < allSendConn.length; i++){
                if(global.io.to(allSendConn[i]) != undefined){
                    global.io.to(allSendConn[i]).emit('groupChat', resp);
                }
            }
        }catch(err){
            console.error(err);
        }

    }catch(err){
        console.error(err);
    }
}

const handleTribeChat = async (req)    =>  {
    try{
        const rules = {
            'user_id'   :   'required',
            'channel_id'  :   'required',
            'message'   :   'required'
        }

        let validator = new Validator(req, rules);

        if(validator.fails()){
            let err = { error: true, status: 'FAILED', message: "Validation errors", "validation": validator.errors };
            global.io.to(req.socket_id).emit('showError', err);
            return false;
        }

        let isJoined = await TribeJoinedUser.getJoinedId(req.user_id, req.channel_id);

        if(!isJoined){
            let err = { error: true, status: 'FAILED', message: "User is not a member of this tribe" };
            global.io.to(req.socket_id).emit('showError', err);
            return false;
        }

        let msgData = {
            'user_id'   :  req.user_id,
            'tribe_id'  :  req.channel_id,
		    'message'   :  req.message,
        };
        // save to tribe group chat
        let tribeMsg = await TribeGroupChat.createMessage(msgData);

        if(!tribeMsg){
            let err = { error: true, status: 'FAILED', message: "Can not send message to this tribe"};
            global.io.to(req.socket_id).emit('showError', err);
            return false;
        }

        let tribeUsers = await TribeJoinedUser.tribeUsers(req.channel_id);

        let senderDetails = await UserInfo.getUser(req.user_id);

        let senderProfile =  `${process.env.MAIN_DOMAIN_URL}public/uploads/users/default_user.png`;
        let senderFullName = "";
        if(senderDetails !=null ){
            if(senderDetails.profile_img != null && senderDetails.profile_img != ""){
                senderProfile =  `${process.env.MAIN_DOMAIN_URL}public/uploads/users/${senderDetails.profile_img}`;
            }

            if(senderDetails.first_name != null){
                senderFullName = senderDetails.first_name;
            }

            if(senderDetails.last_name != null){
                senderFullName = `${senderFullName} ${senderDetails.last_name}`;
            }

        }

        let usersList = tribeUsers.map( users => users.user_id);
        usersList = Array.from( new Set(usersList));
        
        let allSendConn = await Utilities.getMultiConnections(usersList);

        let resp = {
            "type"  :  "TRIBE",
            "to"    :  req.channel_id,
            "from"  : req.user_id,
            "message"   :  req.message,
            "time"  :  "",
            "sender_name"  :  senderFullName,
            "sender_profile"  :  senderProfile,
            "cid"	:	req.cid
        };
        try{
            for(let i = 0; i < allSendConn.length; i++){
                if(global.io.to(allSendConn[i]) != undefined){
                    global.io.to(allSendConn[i]).emit('groupChat', resp);
                }
            }
        }catch(err){
            console.error(err);
        }

        return true;
    }catch(err){
        console.error(err);
    }
}

module.exports = {
    joinChat,
    handleMessage,
    handleEventChat,
    handleTribeChat
}
