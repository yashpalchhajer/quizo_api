'use strict';
const {EVENT_JOINED_USER} = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const EventJoinedUser = sequelize.define(EVENT_JOINED_USER, {
    joining_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    event_id:{
      type: DataTypes.INTEGER,
      allowNull:false
    }
  }, {});

  EventJoinedUser.getJoinedId = (userId, eventId) => {
      return new Promise((resolve, reject) => {
        EventJoinedUser.scope('excludeCreatedAtUpdateAt').findOne({
            where: {
                user_id: userId, 
                event_id: eventId
            }
        }).then(joinData => {
            if(!joinData){
                reject("User has not joined this event");
            }

            resolve(joinData);

        }).catch(err => {
            console.error("Error in User request fetch" ,err);
            reject(err);
        })
      })
  };

  EventJoinedUser.eventUsers = (eventId) => {
    return new Promise((resolve, reject) => {
      EventJoinedUser.scope('excludeCreatedAtUpdateAt').findAll({
          where: {
            event_id: eventId
          }
      }).then(joinData => {
          if(!joinData){
              reject("No users found for this events");
          }

          resolve(joinData);

      }).catch(err => {
          console.error("Error in fetch user events" ,err);
          reject(err);
      })
    })
}

  return EventJoinedUser;
};