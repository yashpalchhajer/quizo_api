'use strict';

const UserMaster = require('../models').users;

const Validator = require('validatorjs');
const jwt = require('jsonwebtoken');

const getLoginToken = async (req, res, next) => {
    try{

        let reqBody = req.body;
        const rules = {
            email: 'required',
            password: 'required'
        };

        const validate = new Validator(reqBody, rules);

        if(validate.fails()){
            return res.status(400).json({error: true, status: 'FAILED', message: 'Validaton errors',"validation": validate.errors });
        }

        UserMaster.scope('excludeCreatedAtUpdateAt').findOne({
            where: {email: reqBody.email}//, active: 1}
        }).then(user    =>  {
            if(!user){
                return res.status(500).json({error: true, status: 'FAILED', message: 'User not found with this id'});
            }

            // more checks for use auth
            var token = jwt.sign({userId: user.id}, user.password, {
                expiresIn: 86400
            });

            let responseArr = {
                error: false,
                status: 'SUCCESS',
                data: { "token": token}
            };
            return res.status(200).json(responseArr);

        }).catch(error => {
            console.error(error);
            return res.status(500).json({error: true, status: 'FAILED', message: 'Some error occured on server'});
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({ error: true, status: 'FAILED', message : 'Some error occured on server'});
    }
}

const check = async (req, res, next) => {
    console.log(req.body);
    console.log(req.user);

    let responseArr = {
        error: false,
        status: 'SUCCESS',
        data: { "user": req.user}
    };
    return res.status(200).json(responseArr);
}

module.exports = {
    getLoginToken,
    check
}