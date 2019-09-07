'use strict';
const { TABLE_OTP_TOKENS } = require('../config/dbConstant');

const dateFormat = require('dateformat');
module.exports = (sequelize, DataTypes) => {
  const OTPTokens = sequelize.define(TABLE_OTP_TOKENS, {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    otp: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    action: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    retry_available: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    valid_upto: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {});
  OTPTokens.associate = function (models) {
    OTPTokens.belongsTo(models.qa_players, {
      through: 'players',
      as: 'player',
      foreignKey: 'player_id'
    });
  };

  OTPTokens.generateOTP = (player, action) => {
    return new Promise( async (resolve, reject) => {
      let otp = Math.floor(Math.random() * (+Number(process.env.OTP_LENTGH) - +1)) + +1 + +Number(process.env.OTP_LENTGH);
      
      const validUpto = dateFormat('yyyy-mm-dd HH:MM:ss');

      await OTPTokens.update(
        {is_valid: false},
        {
          where:
            {
              player_id: player.id,
              action: action
            }
          }
      );

      OTPTokens.create({
        player_id: player.id,
        otp: otp,
        action: action,
        retry_available: process.env.RETRY_AVAILABLE,
        valid_upto: validUpto
      }).then(otpToken => {
        resolve(otpToken.otp);
      })
        .catch(err => { console.log(err); reject(err) });

    });
  }

  OTPTokens.checkOTP = (reqData,resend = false) => {
    return new Promise((resolve, rejector) => {
      let conditions = {};
      if(resend){
        conditions = {
          player_id: reqData.player_id,
          action: reqData.action,
          is_valid: 1
        };
      }else{
        conditions = {
          player_id: reqData.player_id,
          otp: reqData.otp,
          action: reqData.action,
          is_valid: 1
        };
      }

      OTPTokens.findOne(
        {
          where: conditions
        }
      ).then(otpToken => {
        resolve(otpToken)
      })
        .catch(err => {
          console.log(err);
          rejector(err)
        });
    })
  }


  OTPTokens.resendOTP = (player, action,retry) => {
    return new Promise((resolve, reject) => {
      let otp = Math.floor(Math.random() * (+Number(process.env.OTP_LENTGH) - +1)) + +1 + +Number(process.env.OTP_LENTGH);
      
      const validUpto = dateFormat('yyyy-mm-dd HH:MM:ss');

      OTPTokens.create({
        player_id: player.id,
        otp: otp,
        action: action,
        retry_available: retry,
        valid_upto: validUpto
      }).then(otpToken => {
        // console.log(otpToken);
        resolve(otpToken.otp);
      })
        .catch(err => { console.log(err); reject(err) });

    });
  }

  return OTPTokens;
};
