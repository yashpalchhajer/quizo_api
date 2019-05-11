'use strict';
const { TABLE_PLAYERS } = require('../config/dbConstant');
const Sequelize = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  const Players = sequelize.define(TABLE_PLAYERS, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    merchant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'merchantmaster', key: 'id' }
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contact_number: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('M', 'F', 'T'),
      allowNull: true
    },
    profile_img_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'TERMINATE'),
      allowNull: false,
      defaultValue: 'ACTIVE'
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  Players.associate = function (models) {
    Players.belongsTo(models.qa_merchant_masters, {
      through: 'merchants',
      as: 'player',
      foreignKey: 'merchant_id'
    });

    /*   Players.belongToMany(models.qa_players_availables,{
        through: 'playeravailbles',
        as: 'availability',
        foreignKey: 'id'
      }); */

    // associations can be defined here
  };

  Players.checkPlayerExistance = (mobile) => {
    return new Promise((resolve, rejector) => {
      Players.findOne(
        {
          where: { contact_number: mobile }
        }
      ).then(player => {
        console.log('Found');
        resolve(player)
      })
        .catch(err => {
          console.log(err);
          rejector(err)
        });
    });
  };

  Players.register = (reqData) => {
    return new Promise((resolve, reject) => {
      let name = reqData.name;
      let merchant_id = reqData.merchant_id;
      let contact_number = reqData.contact_number;
      let email = reqData.email || null;
      let gender = reqData.gender || null;

      Players.create({
        name: name,
        contact_number: contact_number,
        merchant_id: merchant_id,
        email: email,
        gender: gender
      })
        .then((player) => {
          resolve(player.get({ plain: true }));
        }).catch(err => reject(err));
    });
  }

  Players.getDetails = (ids) => {
    return new Promise((resolve, reject) => {
      Players.findAll({
        raw: true,
        where: {
          id: { [Sequelize.Op.in]: ids }
        },
        attributes: ['name']
      }).then((data) => {
        resolve(data);
      }).catch(err => {
        reject(err);
      })
    });
  }

  return Players;
};