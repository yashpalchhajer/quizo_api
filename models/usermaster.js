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


  UserMaster.setLastActive = async (id) =>  {

      let activeTime = await DateHandlers.addMinutes(new Date(), process.env.ACTIVE_MINUTES);
      console.log('without utc', activeTime);

      activeTime = await DateHandlers.dateToYMD(activeTime);
      console.log('To YDM ' , activeTime);

      DateHandlers.updateTime(id, activeTime);
    
  }

  return UserMaster;
};