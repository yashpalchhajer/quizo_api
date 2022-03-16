'use strict';
const {TRIBE_JOINED_USERS} = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const TribeJoinedUsers = sequelize.define(TRIBE_JOINED_USERS, {
    joining_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tribe_id:{
      type: DataTypes.INTEGER,
      allowNull:false
    }
  }, {});

  TribeJoinedUsers.getJoinedId = (userId, tribeId) => {
      return new Promise((resolve, reject) => {
        TribeJoinedUsers.scope('excludeCreatedAtUpdateAt').findOne({
            where: {
                user_id: userId, 
                tribe_id: tribeId
            }
        }).then(joinData => {
            if(!joinData){
                reject("User has not joined this tribe");
            }
            resolve(joinData);
        }).catch(err => {
            console.error("Error in User request fetch" ,err);
            reject(err);
        })
      })
  };

  TribeJoinedUsers.tribeUsers = (tribeId) => {
    return new Promise((resolve, reject) => {
      TribeJoinedUsers.scope('excludeCreatedAtUpdateAt').findAll({
          where: {
            tribe_id: tribeId
          }
      }).then(joinData => {
          if(!joinData){
              reject("No users found for this tribe");
          }
          resolve(joinData);
      }).catch(err => {
          console.error("Error in fetch user tribe" ,err);
          reject(err);
      })
    })
}

  return TribeJoinedUsers;
};