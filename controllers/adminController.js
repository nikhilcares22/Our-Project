const ValidatorService = require('../validator/joi')
const Model = require('../models');
const dbService = require('../db/dbServices');
const jwtService = require('../services/jwtService');
const twilioService = require('../services/twilioService');
const emailService = require('../services/emailService');
const UploadService = require('../services/UploadService');
const constants = require('../constants/constants');
module.exports = {
    test: async (req, res, next) => {
        try {
            console.log(req.file);
            let result = UploadService.imageUpload(req.file.buffer, req.file.originalname)
            return res.success(constants.SUCCESSFULL, result)
        } catch (error) {
            console.log(error);
        }
    },
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
            let result = await new Model.User(req.body).save();
            result.password = result.generateHash(req.body.password)
            await result.save()
            return res.success(constants.true, result, 200);
        } catch (error) {
            next(error);
        }
    },
    signin: async (req, res, next) => {
        try {
            req.body = ValidatorService.validateAdminSignin(req.body)
            // console.log(req.body);
            let resultUser = await Model.User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] }).select('password')
            // console.log(resultUser);
            // if (!resultUser) return res.error(constants.NOTFOUND, 201)
            // console.log(resultUser.comparePassword(req.body.password))
            if (!resultUser || !(resultUser.comparePassword(req.body.password))) return res.error(constants.INVALIDCRED, 201);
            let authToken = jwtService.generateToken({ id: resultUser._id, role: 'Admin' })
            let newObj = {
                authToken: authToken
            }
            let updatedUser = await Model.User.findOneAndUpdate({ _id: resultUser._id }, newObj, { new: true }).select('-password')
            return res.success(constants.LOGINSUCCESS, updatedUser, 200)
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    changePassword: async (req, res, next) => {
        try {
            if (!type) {
                ValidatorService.validChangePassword(req.body);
                let a = req.user.comparePassword(req.body.oldPassword)
                if (!a) return res.error(constants.INVALIDPASS, 401)
                let newObj = {
                    password: req.user.generateHash(req.body.password)
                }
                let updatedUser = await Model.User.findByIdAndUpdate(req.user._id, newObj, { new: true });
                return res.success(constants.PWDCHANGED, updatedUser, 200)
            }
            if (type == 'verified') {

            }
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

                let info = await emailService.sendMail({ email: email, type: 1, token: newfoundUser.resetPasswordToken, subject: 'Reset Password' })
                return res.success(constants.EMAILSENTSUCCESS, info.accepted, 200);
            }
            if (type == 'phone') {
                let foundUser = await dbService.checkIfExisting(Model.User, { phone: phone }, 'phone');
                foundUser.generateOtpPasswordReset()
                let newFoundUser = await foundUser.save();
                console.log(`${constants.BASEURL}verifyUser?code=${newFoundUser.resetOtp}&type=phone`)
                let result = await twilioService.sendSMS({ phone: `91${phone}`, otp: newFoundUser.resetOtp, link: `${constants.BASEURL}verifyUser?code=${newFoundUser.resetOtp}&type=phone` })
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
            let qry;
            if (type == 'phone') {//phone case
                qry = { resetOtp: code, resetOtpExpires: { $gt: Date.now() } }
            } else {//email case
                qry = { resetPasswordToken: code, resetPasswordExpires: { $gt: Date.now() } }
            }
            let foundUser = await Model.User.findOne(qry)
            if (!foundUser) return res.error(constants.TOKENEXPIRED, 201)
            foundUser.authToken = jwtService.generateToken({ id: foundUser._id, role: 'Admin' });
            type == 'phone' ? foundUser.resetOtp = undefined : foundUser.resetPasswordToken = undefined;
            type == 'phone' ? foundUser.resetOtpExpires = undefined : foundUser.resetPasswordExpires = undefined;
            await foundUser.save();
            return res.success(type == 'phone' ? constants.OTPVERIFIED : constants.USERVERIFIED, foundUser, 201)
        } catch (error) {
            console.log(error)
            next(error);
        }
    },
    getProfile: async (req, res, next) => {
        try {
        req.user = await Model.User.findById(req.user._id)
        return res.success(constants.SUCCESSFULL, req.user, 200)
        } catch (error) {
            console.log(error)
            next(error);
        }
    },
    updateProfile: async (req, res, next) => {
        try {
            req.body = ValidatorService.validateUpdateProfile(req.body)
            if (req.file) req.body.profilePic = req.file.filename
            let foundUser = await Model.User.findOneAndUpdate({ _id: ObjectId(req.user._id) }, { $set: req.body }, { new: true })
            return res.success(constants.UPDATED, foundUser, 201)

        } catch (error) {
            console.log(error)
            next(error)
        }

    }
}