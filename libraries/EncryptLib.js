'use strict';

const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');



const getDeviceToken = async () => {

}

const getAccessToken = (player) => {
    return new Promise((resolve,reject) => {
        let token = jwt.sign(
            {
                player_id:player.id,
                contact:player.contact_number
            },'123456',{
            expiresIn: 86400
        });

        resolve(token);
    });
}

module.exports = {
    getAccessToken
}