const twilio = require('twilio')
const client = new twilio(process.env.TWILIOSID, process.env.TWILIOAPI);
module.exports = {
    sendSMS: function (data) {
        return new Promise(async (resolve, reject) => {
            try {
                let message = await client.messages.create({
                    body: `Your One time password ${data.otp}
                    Please click on the link below and fill the otp there.
                    ${data.link}`,
                    to: data.phone,
                    from: '+16504190743'
                })
                return resolve(message.body)
            } catch (error) {
                console.log(error);
                reject(error)
            }
        })
    }
}