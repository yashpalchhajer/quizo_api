'use strict';

const UserRequestChats = require('../models').user_request_chats;

const isEligibleForChat = async (from, to) => {
    try{
        let chatRequest = await UserRequestChats.getRequest(from, to);

        if(!chatRequest){

            /** @TODO
            * need to re factor reverCheck condition, it need to do in one query with (from, to) or (to, from)
            * but operator was not working and due to lack of time this solution was implemented
            * will 
            */ 
            let reverseCheck = await UserRequestChats.getRequest(to, from);
            if(!reverseCheck){
                let err = { error: true, status: 'FAILED', message: "User is not authorized to chat" };
                console.log(err);
                // global.io.sockets.connected[reqBody.socket_id].emit('showError', err);
            }else{
                return true;
            }
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