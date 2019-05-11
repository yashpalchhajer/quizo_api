'use strict';

const addMinutes = async (dt,minutes) => {
    return new Date(dt.getTime() + minutes*60000);
}


module.exports = {
    addMinutes
};