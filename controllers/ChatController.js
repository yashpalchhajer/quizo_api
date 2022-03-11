'use strict';

const Validator = require('validatorjs');

const ErrorCode = require('../config/ErrorCode');
const Utilities = require('../libraries/Utilities');

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


module.exports = {
    joinChat
}
