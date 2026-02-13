const express = require('express');
const router = express.Router();
console.log('--- userRoutes.js loaded ---');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-otp -otpExpires');

            if (!req.user) {
                console.log('Protect Middleware: User not found for ID', decoded.id);
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error('Protect Middleware Error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.log('Protect Middleware: No token');
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    console.log('GET /api/user/profile hit for user:', req.user._id);
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            addresses: user.addresses
        });
    } else {
        console.log('User not found in profile route');
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                addresses: updatedUser.addresses,
                token: req.headers.authorization.split(' ')[1] // Return same token
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Profile Update Error:', error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already in use` });
        }
        res.status(500).json({ message: 'Server Error during profile update' });
    }
});

// @desc    Add new address
// @route   POST /api/user/address
// @access  Private
router.post('/address', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const newAddress = req.body;

        // If set as default, unset others
        if (newAddress.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push(newAddress);
        await user.save();
        res.json(user.addresses);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc    Delete address
// @route   DELETE /api/user/address/:id
// @access  Private
router.delete('/address/:id', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.addresses = user.addresses.filter(
            (addr) => addr._id.toString() !== req.params.id
        );
        await user.save();
        res.json(user.addresses);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;
