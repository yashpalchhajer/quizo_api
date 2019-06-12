'use strict'

const nodemailer = require('nodemailer');

const mail = async (req, res) => {

    let test = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "edaf0050124cb1",
            pass: "26ff6347553805"
        }
    });

    let info = await transporter.sendMail({
        from: 'yashpalchhajer@gmail.com',
        subject: '"Free Demo"',
        to: 'yashpalchhajer@mailinator.com',
        text: 'Hello World',
        html: '<h1> Hello World </h1>'
    });

    console.log(info.messageId);

    return res.status(200).json(['done']);

}

module.exports = mail;