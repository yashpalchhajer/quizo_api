'use strict';

const randomOption = (obj) => {
    var keys = Object.keys(obj)
    return obj[keys[ keys.length * Math.random() << 0]];
};

const usleep = (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve,ms);
    });
}

const getRandomSeconds = (min, max) => {
    return Math.random() * (max - min) + min;
  }

module.exports = {
    randomOption,
    usleep,
    getRandomSeconds
}

