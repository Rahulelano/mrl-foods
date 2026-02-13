const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware
app.use((req, res, next) => {
    console.log(`[RECEIVE] ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
app.use(cors({
    origin: true, // Allow all origins (or you can specify 'http://localhost:8080')
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Routes
console.log('Loading routes...');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const uploadRoutes = require('./routes/uploadRoutes');
const siteSettingsRoutes = require('./routes/siteSettingsRoutes');

console.log('Registering routes...');
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', require('./routes/paymentRoutes'));

try {
    const userRoutes = require('./routes/userRoutes');
    console.log('User Routes loaded type:', typeof userRoutes);
    if (typeof userRoutes === 'function') console.log('User Routes seems valid (Router)');
    app.use('/api/user', userRoutes);
} catch (err) {
    console.error('Failed to load user routes:', err);
}

app.use('/api/upload', uploadRoutes);

// Debug middleware for settings route
app.get('/api/user/test-inline', (req, res) => {
    res.send('Inline route working');
});

// Debug: Print all routes
app.get('/debug-routes', (req, res) => {
    const routes = [];
    app._router.stack.forEach((middleware) => {
        if (middleware.route) { // routes registered directly on the app
            routes.push(middleware.route.path);
        } else if (middleware.name === 'router') { // router middleware 
            routes.push(`ROUTER: ${middleware.regexp}`);
        }
    });
    res.json(routes);
});

app.use('/api/settings', (req, res, next) => {
    console.log(`Settings API hit: ${req.method} ${req.url}`);
    next();
}, siteSettingsRoutes);

app.get('/test', (req, res) => {
    res.send('Test route working');
});

const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Database Connection
const connectDB = require('./config/db');
connectDB();

app.get('/', (req, res) => {
    res.send('MRL Foods API is running...');
});

app.use((req, res, next) => {
    console.log(`404: ${req.method} ${req.url}`);
    res.status(404).send(`Cannot ${req.method} ${req.url}`);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Routes registered: /api/products, /api/auth, /api/upload, /api/settings`);
});
