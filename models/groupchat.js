'use strict';
const {GROUP_CHAT} = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const GroupChat = sequelize.define(GROUP_CHAT, {
    group_chat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    message:{
      type: DataTypes.TEXT,
      allowNull:false
    },
    event_info_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at:{
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at:{
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
  }, {
    freezeTableName: true,
    tableName: GROUP_CHAT
  });

  GroupChat.createMessage = (messageData) => {
      return new Promise((resolve, reject) => {
        GroupChat.create(messageData)
            .then(msg => {
                    resolve(msg);
            })
            .catch(err => reject(err));
      });
  };

  return GroupChat;
};