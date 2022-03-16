'use strict';

const {USER_REQUEST_CHATS} = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const UserRequestChats = sequelize.define(USER_REQUEST_CHATS, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    from:{
      type: DataTypes.INTEGER,
      allowNull:false
    },
    to: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reject: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {});

  UserRequestChats.getRequest = (from, to) => {
      return new Promise((resolve, reject)  =>  {

        sequelize.query("SELECT * FROM `user_request_chats` WHERE (`from` = :from AND `to` = :to) OR (`to` = :from AND `from` = :to)LIMIT 1;",
          { replacements: { from: from, to: to }, type: sequelize.QueryTypes.SELECT }
        ).then(function(req){

          if(req.length <= 0){
            reject("User request not found");
          }
          resolve(req);
        }).catch(err => reject(err));

      });
  }


  return UserRequestChats;
};