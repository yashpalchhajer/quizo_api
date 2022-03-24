'use strict';

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

module.exports = {
    addMinutes,
    getUTCDateTime
};