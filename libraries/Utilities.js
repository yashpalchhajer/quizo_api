'use strict';

const generateReferenceId = (prov) => {
    let curDate = new Date();

    let year = curDate.getFullYear().toString().substr(-2);
    let month = ("0" + (curDate.getMonth() + 1)).slice(-2);
    let randomChar           = '';

    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( var i = 0; i < 3; i++ ) {
        randomChar += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return ""+year+""+month+""+prov+""+randomChar.toUpperCase();
}


const checkUserConnected = (userId) => {
    let pos = null;
    for(let i = 0; i < global.socketUsers.length; i++){
        if(global.socketUsers[i].userId == userId){
            pos = i;
            break;
        }
    }

    return pos;

}

const getMultiConnections = async (userIds) => {

    let positions = [];
    for(let j = 0; j < userIds.length; j++){
        let pos = checkUserConnected(userIds[j]);
        if(pos != null){
            if(global.socketUsers.hasOwnProperty(pos)){
                positions = positions.concat(global.socketUsers[pos].conn);
            }
        }
    }

    return positions;
}

module.exports = {
    generateReferenceId,
    checkUserConnected,
    getMultiConnections
}

