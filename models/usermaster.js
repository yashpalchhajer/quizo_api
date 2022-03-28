'use strict';
const {TABLE_USER_MASTER} = require('../config/dbConstant');
const DateHandlers = require('../libraries/DateHandlers');

module.exports = (sequelize, DataTypes) => {
  const UserMaster = sequelize.define(TABLE_USER_MASTER, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    password:{
      type: DataTypes.STRING(50),
      allowNull:false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lastActive: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {});


  UserMaster.setLastActive = async (userId) =>  {
      let activeTime = await DateHandlers.addMinutes(new Date(), process.env.ACTIVE_MINUTES);
      UserMaster.update({
        lastActive: activeTime
      },{
        where: {
          id: userId
        }
      }).then((res) => {
        
      }).catch(err => {
        console.error("Error in Set User Active ", err);
      });
    
  }

  return UserMaster;
};