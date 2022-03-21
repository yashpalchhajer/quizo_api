'use strict';
const {TRIBE_GROUP_CHAT} = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const TribeGroupChat = sequelize.define(TRIBE_GROUP_CHAT, {
    id: {
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
    tribe_id:{
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
    tableName: TRIBE_GROUP_CHAT
  });

  TribeGroupChat.createMessage = (messageData) => {
      return new Promise((resolve, reject) => {
        TribeGroupChat.create(messageData)
            .then(msg => {
                    resolve(msg);
            })
            .catch(err => reject(err));
      });
  };

  return TribeGroupChat;
};