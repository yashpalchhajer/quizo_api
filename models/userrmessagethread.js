'use strict';

const {USER_MESSAGE_THREAD} = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const UserMessageThread = sequelize.define(USER_MESSAGE_THREAD, {
    thread_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    recipient_id:{
      type: DataTypes.INTEGER,
      allowNull:false
    },
    status: {
      type: DataTypes.ENUM('0','1'),
      allowNull: true
    }
  }, {
    freezeTableName: true,
    tableName: USER_MESSAGE_THREAD
  });


  UserMessageThread.getThreadId = (reqData) => {
    return new Promise((resolve, reject)    =>  {
        UserMessageThread.create(reqData)
        .then(thread => {
            resolve(thread);
        }).catch(err => reject(err));
    });
  }
  return UserMessageThread;
};