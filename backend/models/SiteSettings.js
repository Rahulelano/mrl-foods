const mongoose = require('mongoose');

const siteSettingsSchema = mongoose.Schema({
    heroImages: {
        type: [String],
        required: false,
        default: ['/WhatsApp Image 2026-02-11 at 4.00.30 PM.jpeg']
    },
    marqueeText: {
        type: String,
        required: false,
        default: 'MANUFACTURING OF MACARONI, PASTA, NOODLES ,JAM, SPICES, PEANUT BUTTER, PROTEIN BAR, HEALTH MIX DRINKS, INSTANT FOOD MIX, SPICES, SEASONING POWDERS AND SIMILAR FARINACEOUS PRODUCTS RAW MATER'
    },
    homeHero: {
        title: { type: String, default: 'From Soil to Soul.' },
        subtitle: { type: String, default: 'Authentic. Unadulterated.' },
        description: { type: String, default: 'Eat like your ancestors, live for the future. Handcrafted essentials for the modern households.' }
    },
    aboutHero: {
        tagline: { type: String, default: "The Captain's Log" },
        title: { type: String, default: 'From High Seas to' },
        titleSuffix: { type: String, default: 'Wholesome Grains' }
    },
    logoUrl: {
        type: String,
        default: '/logo.png'
    },
    loadingPage: {
        text: { type: String, default: 'MRL FOODS' },
        imageUrl: { type: String, default: '/logo.png' }
    },
    newsletterSection: {
        title: { type: String, default: 'Global distribution & Third- Party Manufacturing' },
        tagline: { type: String, default: 'Partner with Us' },
        buttonText: { type: String, default: 'Subscribe' }
    },
    shopOurRange: [{
        title: { type: String, required: true },
        image: { type: String, required: true }
    }],
    trendingVideos: {
        type: [String],
        default: []
    },
    posters: {
        type: [String],
        default: []
    },
    features: [{
        icon: String,
        title: String,
        desc: String
    }],
    brands: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

module.exports = SiteSettings;
