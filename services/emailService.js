const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
        user: 'nikhilcares22@gmail.com',
        pass: process.env.EMAILSECRET,
    },
});
module.exports = {
    sendMail: function (data) {
        return new Promise(async (resolve, reject) => {
            let options = {
                from: '"Nikhil Sharma" <nikhilcares22@gmail.com>',
                to: 'nikhil@mailinator.com',
                text: 'hello',
                html: '<h1>sddjsdjka</h1>'
            }
            let info = await transporter.sendMail(options)
            console.log(info);
        })
    }
}