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
        UserRequestChats.scope('excludeCreatedAtUpdateAt').findOne({
            where: {
              from: from, 
              to: to
            }
        }).then(userRequest => {
            if(!userRequest){
                reject("User request not found");
            }

            resolve(userRequest);

        }).catch(err => {
            console.error("Error in User request fetch" ,err);
            reject(err);
        })
      })
  }


  return UserRequestChats;
};