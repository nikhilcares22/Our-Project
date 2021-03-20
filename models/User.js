const mongoose = require('mongoose');
const Bcrypt = require("bcryptjs");
const crypto = require('crypto');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        set: a => a.toLowerCase()
        // unique: true,
        // required: true
    },
    secondaryEmail: [{
        type: String
    }],
    firstName: {
        type: String,
        default: ''
    },
    userName: {
        type: String,
        unique: true,
        sparse: true //unique if not null
    },
    lastName: {
        type: String,
        default: ''
    },
    profilePic: {
        type: String
    },
    countryCode: {
        type: String, default: ''
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        // required: true,
        select: false,
        // get: hashit
    },
    roles: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    gender: {
        type: String,
        enum: ['M', 'F']
    },
    status: {
        type: Number,
        default: 1,
        enum: [0, 1]
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    // isSocialLogin: {
    //     type: Number,
    //     default: 0
    // },
    resetPasswordExpires: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetOtp: {
        type: String,
    },
    resetOtpExpires: {
        type: String,
    },
    authToken: {
        type: String,
    },
    // lat: {
    //     type: Number
    // },
    // lng: {
    //     type: Number
    // },
    // location: {
    //     type: { type: String, default: 'Point' },
    //     coordinates: {
    //         type: Array,
    //         default: [0, 0]
    //     }
    // },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    verificationBy: {
        type: String,
        enum: ['email', 'phone'],
        default: 'email'
    }
},
    {
        timestamps: true,
    }
)

// function hashit(pass) {
//     return pass.replace(/./g, '#')
// }

userSchema.methods.generateHash = function (plainText) {//hashing before saving
    hash = Bcrypt.hashSync(plainText, 10);
    return (hash);
};

userSchema.methods.comparePassword = function (plaintext) {
    console.log('sdussh', this.password);
    return Bcrypt.compareSync(plaintext, this.password)
};

userSchema.methods.generatePasswordReset = function () {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};
userSchema.methods.generateOtpPasswordReset = function () {
    this.resetOtp = Math.floor(Math.random() * 1e6);
    this.resetOtpExpires = Date.now() + 3600000; //expires in an hour
};

module.exports = mongoose.model('User', userSchema);

