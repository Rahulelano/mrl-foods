const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Mock Payment Initiation
router.post('/initiate', async (req, res) => {
    try {
        const { amount } = req.body;
        console.log(`Payment initiation requested for ₹${amount}`);

        res.json({
            success: true,
            message: "Payment initiated",
            url: `/payment/mock?amount=${amount}`
        });

    } catch (error) {
        console.error('Payment Error:', error);
        res.status(500).json({ message: 'Payment initiation failed' });
    }
});

// Mock Payment Success Handler (Sends Email)
router.post('/success', async (req, res) => {
    try {
        const { amount, customerDetails, items } = req.body;

        console.log(`Payment SUCCESS for ₹${amount}`);
        console.log('Sending email confirmation...');

        // Send Email to Admin
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'mrlfoods2023@gmail.com',
            subject: '✅ New Order Confirmed! - MRL Foods',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #6739B7;">MRL Foods - Order Success 🚀</h2>
                    <p>Great news! A new order has been placed and payment is confirmed.</p>
                    
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
                        <h3 style="margin-top: 0;">Customer Details</h3>
                        <p><strong>Name:</strong> ${customerDetails?.name || 'N/A'}</p>
                        <p><strong>Phone:</strong> ${customerDetails?.phone || 'N/A'}</p>
                        <p><strong>Email:</strong> ${customerDetails?.email || 'N/A'}</p>
                        <p><strong>Address:</strong><br/>
                        ${customerDetails?.street}, ${customerDetails?.city}, ${customerDetails?.zip}</p>
                    </div>
                    
                    <h3>Order Summary</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 2px solid #eee;">
                            <th style="text-align: left; padding: 10px;">Item</th>
                            <th style="text-align: center; padding: 10px;">Qty</th>
                            <th style="text-align: right; padding: 10px;">Price</th>
                        </tr>
                        ${items?.map(item => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 10px;">${item.name}</td>
                                <td style="text-align: center; padding: 10px;">${item.quantity}</td>
                                <td style="text-align: right; padding: 10px;">₹${item.price * item.quantity}</td>
                            </tr>
                        `).join('')}
                        <tr>
                            <td colspan="2" style="text-align: right; padding: 10px;"><strong>Total Amount Paid:</strong></td>
                            <td style="text-align: right; padding: 10px;"><strong>₹${amount}</strong></td>
                        </tr>
                    </table>
                    
                    <p style="margin-top: 30px; font-size: 12px; color: #888;">
                        This is an automated notification for MRL Foods Admin.
                    </p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email error:', error);
            } else {
                console.log('Order Confirmation Email sent: ' + info.response);
            }
        });

        res.json({ success: true, message: "Order processed and email sent" });

    } catch (error) {
        console.error('Success Route Error:', error);
        res.status(500).json({ message: 'Failed to process success callback' });
    }
});

module.exports = router;
