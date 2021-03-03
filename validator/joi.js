const joi = require('joi');

module.exports = {
    //admin
    validateAdminSignup: function (data) {
        const joiSchema = joi.object({
            firstName: joi.string().min(3).trim().required(undefined, { presence: "required" }),
            lastName: joi.string().min(3).trim().optional(),
            // userName: joi.string().min(5).optional(),
            email: joi.string().trim().email(),
            password: joi.string(),
            confirmPassword: joi.any().valid(joi.ref('password')).required().messages({ "any.only": 'Confirm password must be same as password' }),
            countryCode: joi.string().required(),
            phone: joi.number().required()
        })
        let { error, value } = joiSchema.validate(data)
        if (error) throw (`Validation Error: ${error.details.map(x => x.message).join(' ,')}`)
        return value;
    },
    validateAdminSignin: function (data) {
        const joiSchema = joi.object({
            userName: joi.string().min(5).optional(),
            email: joi.string().trim().email(),
            password: joi.string(),
            confirmPassword: joi.any().valid(joi.ref('password')).required().messages({ "any.only": 'Confirm password must be same as password' }),
            phone: joi.number(),
            countryCode: joi.string().when('phone', { is: joi.exist(), then: joi.required() }),
        })
        let { error, value } = joiSchema.validate(data)
        if (error) throw (`Validation Error: ${error.details.map(x => x.message).join(' ,')}`)
        return value;
    },
    validChangePassword: function (data) {
        const joiSchema = joi.object({
            oldPassword: joi.string().required(),
            password: joi.string().required(),
            confirmPassword: joi.any().valid(joi.ref('password')).required().messages({ "any.only": 'Confirm password must be same as password' }),
        })
        let { error, value } = joiSchema.validate(data)
        if (error) throw (`Validation Error: ${error.details.map(x => x.message).join(' ,')}`)
        return value;
    },
    validResetPassword: function (data) {
        const joiSchema = joi.object({
            email: joi.string().email(),
            phone: joi.number(),
            type: joi.any().allow('email', 'phone').required(),
        })
            .or('phone', 'email');

        let { error, value } = joiSchema.validate(data)
        if (error) throw (`Validation Error: ${error.details.map(x => x.message).join(' ,')}`)
        return value;
    },
    validateUser: function (data) {
        const joiSchema = joi.object({
            firstName: joi.string().min(3).trim().required(undefined, { presence: "required" }),
            lastName: joi.string().min(3).trim().optional(),
            // userName: joi.string().min(5).optional(),
            role: joi.any().allow('user', 'admin'),
            email: joi.string().trim().email(),
            password: joi.string(),
            confirmPassword: joi.any().valid(joi.ref('password')).required().messages({ "any.only": 'Confirm password must be same as password' }),
            countryCode: joi.string(),
            phone: joi.number()
        })
        // return joi.validate(data, joiSchema)
        let { error, value } = joiSchema.validate(data)
        if (error) throw (`Validation Error: ${error.details.map(x => x.message).join(' ,')}`)
        return value;
    }
}
