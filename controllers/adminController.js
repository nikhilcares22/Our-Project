const ValidatorService = require('../validator/joi')
const Model = require('../models');
const dbService = require('../db/dbServices');
const jwtService = require('../services/jwtService');
const twilioService = require('../services/twilioService');
const emailService = require('../services/emailService');
const constants = require('../constants/constants');
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
            // let { email, phone, type } = req.body;
            // if ((!email && !phone) || !type) return res.error(constants.REQUIRED, 422)
            // if ((email && type == 'phone') || (phone && type == 'email')) return res.error(constants.INVALIDTYPE, 422)
            ValidatorService.validResetPassword(req.body);
            let { type, phone, email } = req.body
            if (type == 'email') {
                let foundUser = await dbService.checkIfExisting(Model.User, { email: email }, 'email');

                foundUser.generatePasswordReset();
                let newfoundUser = await foundUser.save();

                // let newfoundUser = await dbService.checkIfExisting(Model.User, { email: email }, 'email');

                let info = await emailService.sendMail({ email: email, type: 1, token: newfoundUser.resetPasswordToken })
                return res.success(constants.EMAILSENTSUCCESS, info.accepted, 200);
            }
            if (type == 'phone') {
                let foundUser = await dbService.checkIfExisting(Model.User, { phone: phone }, 'phone');
                foundUser.generateOtpPasswordReset()
                let newFoundUser = await foundUser.save();
                console.log(`${constants.BASEURL}/verifyUser/?code=${newFoundUser.resetOtp}&type=phone`)
                let result = await twilioService.sendSMS({ phone: `91${phone}`, otp: newFoundUser.resetOtp, link: `${constants.BASEURL}verifyUser/?code=${newFoundUser.resetOtp}&type=phone` })
                return res.success(constants.SMSSENTSUCCESS, result, 200)
            }
        } catch (error) {
            console.log(error)
            next(error);
        }
    },
    verifyUser: async (req, res, next) => {
        try {
            let { type, code } = req.query;
            // let { code } = req.params;
            if (!type) {
                console.log(code, type, Date.now());
                console.log(1614617839732 > Date.now());
                let foundUser = await Model.User.findOne({ resetPasswordToken: code, resetPasswordExpires: { $gt: Date.now() } });
                if (!foundUser) return res.render()
            }
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
}