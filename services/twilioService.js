// const twilio = require('twilio')
// const client = new twilio(process.env.TWILIOSID, process.env.TWILIOAPI);
// module.exports = {
//     sendSMS: function (data) {
//         return new Promise(async (resolve, reject) => {
//             try {
//                 let message = await client.messages.create({
//                     body: `Your One time password ${data.otp}
//                     Please click on the link below and fill the otp there.
//                     ${data.link}`,
//                     to: data.phone,
//                     from: '+14027043438'
//                 })
//                 return resolve(message.body)
//             } catch (error) {
//                 console.log(error);
//                 reject(error)
//             }
//         })
//     }
// }



const axios = require("axios");
const postData = {
    from: "447537404817",
    to: ["919417878607"],
    body: "This is a test message from your Sinch account",
};
module.exports = {
    sendSMS: function (data) {
        return new Promise((resolve, reject) => {
            const axiosConfig = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer 64c5265d09c146728a0e59a0fad006c2",
                },
            };

            axios
                .post(
                    "https://sms.api.sinch.com/xms/v1/0884eac50b164db0ae8e1d0f874e1c70/batches",
                    {
                        from: "447537404817",
                        to: [data.phone],
                        body: `Your One time password ${data.otp}
                        Please click on the link below and fill the otp there.
                        ${data.link}`,
                    },
                    axiosConfig
                )
                .then((json) => {
                    return resolve(true)
                })
                // .catch((error) => {
                //     console.error(error);
                //     return reject(error)
                // });
        })

    }
}