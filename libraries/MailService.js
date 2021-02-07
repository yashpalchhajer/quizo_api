'use strict'

const nodemailer = require('nodemailer');

const mail = async (req, res) => {

    let test = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    let info = await transporter.sendMail({
        from: process.env.MAIL_FROM,
        subject: process.env.MAIL_DEFAULT_SUB,
        to: 'yashpalchhajer@mailinator.com',
        text: 'Hello World',
        html: '<h1> Hello World </h1>'
    });

    console.log(info.messageId);

    return res.status(200).json(['done']);

}

module.exports = mail;