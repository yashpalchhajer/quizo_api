'use strict';

const {USER_CHAT_MESSAGE} = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const UserChatMessage = sequelize.define(USER_CHAT_MESSAGE, {
    chat_id: {
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
    chat_meaasge:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    message_thread_id:{
        type: DataTypes.INTEGER,
    },
    is_offline_message:{
        type: DataTypes.INTEGER,
        default: 2
    }
  }, {
    freezeTableName: true,
    tableName: USER_CHAT_MESSAGE
  });
 
  UserChatMessage.insertMessage = (reqData)   =>  {
      return new Promise((resolve, reject)  =>  {
        UserChatMessage.create(reqData).then(message => resolve(message))
            .catch(err => reject(err));
      })
  }

  return UserChatMessage;
};