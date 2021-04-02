const jwt = require('jsonwebtoken');
const Model = require('../models');

module.exports = (...args) => async (req, res, next) => {
    try {
        let token = req.headers.authorization || req.headers.Authorization;
        if (!token) return res.error(constants.TOKENMISSING, 401)
        if (!args.length) return res.error(constants.NOROLE)
        let decoded = jwt.verify(token, process.env.SECRETKEY)
        let role
        for (i = 0; i < args.length; i++) {
            if (!!decoded.data.role && 'is' + decoded.data.role == args[i]) {
                role = 'is' + decoded.data.role
                break;
            }
        }
        if (!role) return res.error(constants.FORBIDDEN, 401)
        let found
        if (role == 'isAdmin') {
            found = await Model.User.findOne({ _id: decoded.data.id, roles: 'admin', isDeleted: false, authToken: token })
            if (!found) return res.error(constants.NOTANADMIN, 404)
        }
        else if (role == 'isUser') {
            found = await Model.User.findOne({ _id: decoded.data.id, roles: 'user', isDeleted: false, authToken: token })
            if (!found) return res.error(constants.NOTAUSER, 404)
        }
        else {
            return res.error(constants.INVALIDAUTHROLE, 401)
        }
        req.user = found;
        next();

    } catch (error) {
        console.log(error)
        return res.error(constants.INVALIDTOKEN, 401)
    }
}