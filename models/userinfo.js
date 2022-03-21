'use strict';

const {USER_INFO} = require('../config/dbConstant');

module.exports = (sequelize, DataTypes) => {
  const UserInfo = sequelize.define(USER_INFO, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    first_name:{
      type: DataTypes.STRING(191),
      allowNull:false
    },
    last_name: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    age: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    profile_img: {
        type: DataTypes.STRING(199),
        allowNull: true
    }
  }, {
    freezeTableName: true,
    tableName: USER_INFO
  });

  UserInfo.getUser = (userId) =>  {
    return new Promise((resolve, reject) => {
      UserInfo.findOne({
        where: {
          user_id: userId
        }
      }).then((user) => {

        resolve(user);

      }).catch( err => reject(err));
    })
  }
  return UserInfo;
};