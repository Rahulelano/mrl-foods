const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    phone: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    name: {
        type: String,
        required: false
    },
    otp: {
        type: String,
        required: false
    },
    otpExpires: {
        type: Date,
        required: false
    },
    addresses: [{
        title: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        phone: String,
        isDefault: { type: Boolean, default: false }
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
