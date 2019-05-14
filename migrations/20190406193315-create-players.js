'use strict';
const {TABLE_PLAYERS} = require('../config/dbConstant');
const {TABLE_MERCHANT_MASTER} = require('../config/dbConstant');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_PLAYERS, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      merchant_id:{
        type: Sequelize.INTEGER,
        allowNull:false,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      contact_number: {
        type: Sequelize.STRING(12),
        allowNull: false
      },
      gender:{
        type: Sequelize.ENUM('M','F','T'),
        allowNull:true
      },
      profile_img_url:{
        type: Sequelize.TEXT,
        allowNull:true
      },
      status:{
        type: Sequelize.ENUM('ACTIVE','INACTIVE','TERMINATE'),
        allowNull:false,
        defaultValue:'ACTIVE'
      },
      is_otp_verified:{
        type: Sequelize.ENUM('YES','NO'),
        defaultValue: 'NO'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    })
    .then(() => queryInterface.addConstraint(TABLE_PLAYERS, ['merchant_id'], {
      type: 'FOREIGN KEY',
      name: 'merchant_player',
      references: {
        table: TABLE_MERCHANT_MASTER,
        field: 'id',
      },
      onDelete: 'restrict',
      onUpdate: 'no action',
    }));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_PLAYERS);
  }
};