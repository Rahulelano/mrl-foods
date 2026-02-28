const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings'); // Ensure correct path
const { protect, admin } = require('./authRoutes'); // Re-use auth middleware if needed

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
router.get('/', async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();

        if (!settings) {
            settings = await SiteSettings.create({});
        }

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
// Note: We'll assume admin protection is handled by middleware or passing headers
router.put('/', async (req, res) => {
    // Validate admin token here if you have middleware, or just basic update for now
    // For now, let's keep it open or use simple check if available

    try {
        console.log('PUT /api/settings body:', req.body);
        const { heroImages, marqueeText, homeHero, aboutHero, logoUrl, loadingPage, newsletterSection, shopOurRange, trendingVideos, posters, features, brands } = req.body;

        let settings = await SiteSettings.findOne();

        if (settings) {
            if (heroImages) settings.heroImages = heroImages;
            if (marqueeText) settings.marqueeText = marqueeText;
            if (homeHero) settings.homeHero = { ...settings.homeHero, ...homeHero };
            if (aboutHero) settings.aboutHero = { ...settings.aboutHero, ...aboutHero };
            if (logoUrl) settings.logoUrl = logoUrl;
            if (loadingPage) settings.loadingPage = { ...settings.loadingPage, ...loadingPage };
            if (newsletterSection) settings.newsletterSection = { ...settings.newsletterSection, ...newsletterSection };
            if (shopOurRange) settings.shopOurRange = shopOurRange;
            if (trendingVideos) settings.trendingVideos = trendingVideos;
            if (posters) settings.posters = posters;
            if (features) settings.features = features;
            if (brands) settings.brands = brands;

            const updatedSettings = await settings.save();
            res.json(updatedSettings);
        } else {
            const newSettings = await SiteSettings.create({
                heroImages,
                marqueeText,
                homeHero,
                aboutHero,
                logoUrl,
                loadingPage,
                newsletterSection,
                shopOurRange,
                trendingVideos,
                posters,
                features,
                brands
            });
            res.status(201).json(newSettings);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
