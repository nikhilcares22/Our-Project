const ValidatorService = require('../validator/joi')
const Model = require('../models');
const dbService = require('../db/dbServices');
const jwtService = require('../services/jwtService');
const emailService = require('../services/emailService');
module.exports = {
    signup: async (req, res, next) => {
        try {
            req.body = ValidatorService.validateAdminSignup(req.body)
            // let x = await Model.User.findOne({ email: req.body.email });
            // if (x) return res.error(constants.USEREXIST, 409)
            await dbService.checkExisting(Model.User, { $or: [{ email: req.body.email }, { phone: req.body.phone }] }, `with same email or phone`);
            let newObj = {
                roles: 'admin',
                isVerified: true,
                isPhoneVerified: true,
                isEmailVerified: true
            }
            Object.assign(req.body, newObj)
            let result = await Model.User.create(req.body);
            return res.success(constants.true, result, 200);
        } catch (error) {
            next(error);
        }
    },
    signin: async (req, res, next) => {
        try {
            req.body = ValidatorService.validateAdminSignin(req.body)
            let resultUser = await Model.User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] })
            if (!resultUser.comparePassword(req.body.password)) return res.error(constants.PWDMISMATCH, 401);
            let authToken = jwtService.generateToken({ id: resultUser._id, role: 'Admin' })
            let newObj = {
                authToken: authToken
            }
            let updatedUser = await Model.User.findOneAndUpdate({ _id: resultUser._id }, newObj, { new: true })
            return res.success(constants.LOGINSUCCESS, updatedUser, 200)
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    changePassword: async (req, res, next) => {
        try {
            ValidatorService.validChangePassword(req.body);
            let a = req.user.comparePassword(req.body.oldPassword)
            if (!a) return res.error(constants.INVALIDPASS, 401)
            let newObj = {
                password: req.user.generateHash(req.body.password)
            }
            let updatedUser = await Model.User.findByIdAndUpdate(req.user._id, newObj, { new: true });
            return res.success(constants.PWDCHANGED, updatedUser, 200)
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            emailService.sendMail()

        } catch (error) {
            console.log(error)
            next(error);
        }
    }
}