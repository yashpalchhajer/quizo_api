'use strict';

const mysql = require('mysql2');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const updateTime = (userId, activeTime) => {
    // create the connection to database
    const connection = mysql.createConnection({
        host: config.host,
        user: config.username,
        password: config.password,
        database: config.database
    });
 
    connection.query(
        "UPDATE `users` SET `lastActive`='" + activeTime + "' WHERE `id` = " + userId,
        function(err, results, fields) {
          console.log("Update users last active ", err); // results error
        }
      );

}

const addMinutes = async (dt,minutes) => {
    return new Date(dt.getTime() + minutes*60000);
}

const getUTCDateTime = async () => {
    let date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' + 
        ('00' + date.getUTCHours()).slice(-2) + ':' + 
        ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + date.getUTCSeconds()).slice(-2);
    
    return date;
}

const dateToYMD = (dt) => {
    
    let date = dt.getUTCFullYear() + '-' +
        ('00' + (dt.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + dt.getUTCDate()).slice(-2) + ' ' + 
        ('00' + dt.getUTCHours()).slice(-2) + ':' + 
        ('00' + dt.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + dt.getUTCSeconds()).slice(-2);
    
    return date;
}

module.exports = {
    addMinutes,
    getUTCDateTime,
    dateToYMD,
    updateTime
};