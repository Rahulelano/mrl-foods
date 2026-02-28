const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login attempt:', email);
        const admin = await Admin.findOne({ email });
        console.log('Admin found:', admin ? 'Yes' : 'No');

        if (admin && (await admin.matchPassword(password))) {
            console.log('Password match: Yes');
            res.json({
                _id: admin._id,
                email: admin.email,
                token: generateToken(admin._id),
            });
        } else {
            console.log('Password match: No');
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// OTP Routes

const User = require('../models/User');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// @desc    Request OTP
// @route   POST /api/auth/otp
// @access  Public
router.post('/otp', async (req, res) => {
    const { email, phone } = req.body;

    if (!email && !phone) {
        return res.status(400).json({ message: 'Email or Phone is required' });
    }

    try {
        let user;
        if (email) {
            user = await User.findOne({ email });
            if (!user) user = await User.create({ email });
        } else if (phone) {
            user = await User.findOne({ phone });
            if (!user) user = await User.create({ phone });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        if (email) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your Login OTP for MRL Foods',
                text: `Your OTP is: ${otp}. It is valid for 10 minutes.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Email error:', error);
                    return res.status(500).json({ message: 'Failed to send OTP email' });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.json({ message: 'OTP sent successfully' });
                }
            });
        } else if (phone) {
            // Integrate Fast2SMS
            try {
                const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
                    route: 'otp',
                    variables_values: otp,
                    numbers: phone,
                }, {
                    headers: {
                        "authorization": process.env.FAST2SMS_API_KEY
                    }
                });

                console.log('Fast2SMS Response:', response.data);

                if (response.data.return) {
                    res.json({ message: 'OTP sent successfully via SMS' });
                } else {
                    console.error('Fast2SMS Error:', response.data);
                    // Fallback/Log but still return success to UI to avoid blocking? 
                    // Better to return error if it failed.
                    res.status(500).json({ message: 'Failed to send SMS OTP', details: response.data.message });
                }
            } catch (smsError) {
                console.error('SMS API Error:', smsError.response ? smsError.response.data : smsError.message);
                res.status(500).json({ message: 'Failed to send SMS OTP' });
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Verify OTP
// @route   POST /api/auth/verify
// @access  Public
router.post('/verify', async (req, res) => {
    const { email, phone, otp } = req.body;

    try {
        let user;
        if (email) {
            user = await User.findOne({ email });
        } else if (phone) {
            user = await User.findOne({ phone });
        }

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.otp === otp && user.otpExpires > Date.now()) {
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            res.json({
                _id: user._id,
                email: user.email,
                phone: user.phone,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
