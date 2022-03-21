'use strict';

const UserRequestChats = require('../models').user_request_chats;

const isEligibleForChat = async (from, to) => {
    try{
        let chatRequest = await UserRequestChats.getRequest(from, to);

        if(!chatRequest){
            return false;
        }else{
            return true;
        }
       
    }catch(err){
        console.error('Error generated in User Chat Handler =>', err);

    }

    return false;
}



module.exports = {
    isEligibleForChat
};