const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const axios = require('axios');
const crypto = require('crypto');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// PhonePe V2 Configuration
const PHONEPE_ENV = process.env.PHONEPE_ENV || 'production';

// Select credentials based on environment
const CLIENT_ID = PHONEPE_ENV === 'production' ? process.env.PHONEPE_CLIENT_ID : process.env.PHONEPE_SANDBOX_CLIENT_ID;
const CLIENT_SECRET = PHONEPE_ENV === 'production' ? process.env.PHONEPE_CLIENT_SECRET : process.env.PHONEPE_SANDBOX_CLIENT_SECRET;
const MERCHANT_ID = PHONEPE_ENV === 'production' ? process.env.PHONEPE_MERCHANT_ID : process.env.PHONEPE_SANDBOX_MERCHANT_ID;
const CALLBACK_URL = PHONEPE_ENV === 'production' ? process.env.PHONEPE_CALLBACK_URL : process.env.PHONEPE_SANDBOX_CALLBACK_URL;

const OAUTH_URL = PHONEPE_ENV === 'production'
    ? "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

const PAY_URL = PHONEPE_ENV === 'production'
    ? "https://api.phonepe.com/apis/pg/checkout/v2/pay"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay";

// In-memory token store
let tokenStore = {
    token: null,
    expiresAt: 0
};

/**
 * Get OAuth token with caching
 */
async function getAuthToken() {
    const now = Date.now();
    if (tokenStore.token && now < tokenStore.expiresAt - 60000) { // Keep 1 min buffer
        return tokenStore.token;
    }

    console.log(`--- Fetching New PhonePe OAuth Token (${PHONEPE_ENV}) ---`);
    try {
        const response = await axios.post(OAUTH_URL,
            new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'client_credentials',
                client_version: '1'
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );

        tokenStore.token = response.data.access_token;
        // expires_in is usually in seconds
        tokenStore.expiresAt = now + (response.data.expires_in * 1000);
        return tokenStore.token;
    } catch (error) {
        console.error("PhonePe Token Generation Failed:", error.response?.data || error.message);
        throw new Error("Could not authenticate with PhonePe");
    }
}

// Payment Initiation (V2)
router.post('/initiate', async (req, res) => {
    try {
        const { amount, mobileNumber } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, message: "Amount is required" });
        }

        const token = await getAuthToken();
        const transactionId = `T${Date.now()}`;

        // Standard V2 Pay Page Payload
        const payload = {
            merchantId: MERCHANT_ID,
            merchantOrderId: transactionId,
            merchantUserId: `USER_${Date.now()}`,
            amount: Math.round(amount * 100), // Convert to paise
            redirectUrl: CALLBACK_URL,
            redirectMode: "GET",
            callbackUrl: CALLBACK_URL, // Server-to-server callback
            paymentInstrument: {
                type: "PAY_PAGE",
            },
        };

        console.log(`PhonePe V2 (${PHONEPE_ENV}) Request:`, JSON.stringify(payload, null, 2));

        const response = await axios.post(PAY_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `O-Bearer ${token}`,
                'X-MERCHANT-ID': MERCHANT_ID,
                'accept': 'application/json'
            }
        });

        console.log("PhonePe V2 Response Data:", JSON.stringify(response.data, null, 2));

        if (response.data.success || response.data.redirectUrl || response.data.data?.instrumentResponse) {
            console.log("✅ PhonePe Payment Initiated Successfully!");
            let redirectUrl = response.data.redirectUrl || response.data.data?.instrumentResponse?.redirectInfo?.url;

            // Re-adding the Sandbox UI test mode
            if (PHONEPE_ENV === 'sandbox') {
                const frontendBaseUrl = String(CALLBACK_URL).replace('/api/payment/callback', '').replace('/payment/callback', '');
                redirectUrl = `${frontendBaseUrl}/payment/mock?amount=${amount}&transactionId=${transactionId}`;
                console.log("--- Sandbox Mode: Redirecting to local mock page because PhonePe sandbox skips the UI ---");
            }

            console.log("Redirecting user to:", redirectUrl);

            res.json({
                success: true,
                message: "Payment initiated",
                url: redirectUrl,
                transactionId: transactionId
            });
        } else {
            console.error("PhonePe V2 Error Response:", response.data);
            throw new Error(response.data.message || "PhonePe initiation failed");
        }

    } catch (error) {
        console.error('PhonePe V2 Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        res.status(500).json({
            success: false,
            message: 'Payment initiation failed',
            error: error.response?.data?.message || error.message
        });
    }
});

// Payment Success Handler (Sends Email)
router.post('/success', async (req, res) => {
    try {
        const { amount, customerDetails, items } = req.body;

        console.log(`Order Confirmation for ₹${amount}`);

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
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Order processed and email sent" });

    } catch (error) {
        console.error('Success Route Error:', error);
        res.status(500).json({ message: 'Failed to process success callback' });
    }
});

module.exports = router;
