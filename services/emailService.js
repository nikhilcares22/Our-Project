const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
        user: 'nikhilcares22@gmail.com',
        pass: process.env.EMAILSECRET,
    },
});
const getTypeMsg = function (type, token) {
    let resultText
    switch (type) {
        case 1:
            resultText = `This is the mail for reset password 
            please click on the link below to confirm that it is you who want to reset password or ignore if that's not you ${constants.BASEURL}api/admin/verifyUser?code=${token}`
            break;
        default: throw new Error('No type')
    }
    return resultText;
}
module.exports = {
    sendMail: function (data) {
        return new Promise(async (resolve, reject) => {
            try {
                let options = {
                    from: '"Nikhil Sharma" <nikhilcares22@gmail.com>',
                    to: data.email,
                    text: getTypeMsg(data.type, data.token),
                    subject: data.subject,
                    // html: '<h1>sddjsdjka</h1>'
                }
                console.log(options);
                let info = await transporter.sendMail(options)
                // console.log(info);
                return resolve(info)
            } catch (error) {
                console.log(error);
                reject(error)
            }
        })
    }
}