const jwt = require('jsonwebtoken')
module.exports = {
    generateToken: (data) => {
        return jwt.sign({ data: data }, process.env.SECRETKEY, { expiresIn: "30 d" })
    }
}