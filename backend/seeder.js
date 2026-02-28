const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

// Ideally we'd import this from src/lib/products-data.ts but that is TS and this is JS.
// I will just copy the data here for seeding.

const products = [
    {
        name: "Finger Millet Pasta / Ragi Pasta",
        description: "Healthy and tasty finger millet pasta. Rich in calcium and fiber.",
        price: 145,
        image: "/WhatsApp Image 2026-02-09 at 12.47.59 PM.jpeg",
        category: "Pasta",
        weight: "500g",
        badge: "Bestseller",
    },
    {
        name: "Moringa Pasta",
        description: "Nutrient-packed moringa pasta. A healthy twist to your favorite Italian dish.",
        price: 145,
        image: "/WhatsApp Image 2026-02-09 at 12.52.52 PM.jpeg",
        category: "Pasta",
        weight: "500g",
        badge: "New"
    },
    {
        name: "100% Durum Wheat Semolina Pasta",
        description: "Premium quality pasta made from 100% Durum Wheat Semolina.",
        price: 160,
        image: "/WhatsApp Image 2026-02-09 at 12.57.12 PM.jpeg",
        category: "Pasta",
        weight: "500g",
    },
    {
        name: "100% Durum Wheat Semolina Pasta - Shell Shape",
        description: "Shell-shaped premium pasta made from 100% Durum Wheat Semolina.",
        price: 160,
        image: "/WhatsApp Image 2026-02-09 at 12.59.24 PM.jpeg",
        category: "Pasta",
        weight: "500g",
    },
    {
        name: "Vermicelli",
        description: "Traditional vermicelli for delicious upma, kheer, and payasam.",
        price: 85,
        image: "/WhatsApp Image 2026-02-09 at 1.02.14 PM.jpeg",
        category: "Ready to Cook",
        weight: "500g",
    },
    {
        name: "Roasted Vermicelli",
        description: "Pre-roasted vermicelli for quick and easy cooking.",
        price: 90,
        image: "/WhatsApp Image 2026-02-09 at 1.03.36 PM.jpeg",
        category: "Ready to Cook",
        weight: "500g",
    },
    {
        name: "Wheat Carrot Pasta",
        description: "Nutritious wheat pasta enriched with fresh carrot puree.",
        price: 145,
        image: "/WhatsApp Image 2026-02-09 at 1.09.42 PM.jpeg",
        category: "Pasta",
        weight: "500g",
    },
    {
        name: "Wheat Beetroot Pasta",
        description: "Healthy beetroot pasta made with natural ingredients.",
        price: 145,
        image: "/WhatsApp Image 2026-02-09 at 1.12.09 PM.jpeg",
        category: "Pasta",
        weight: "500g",
    },
    {
        name: "Wheat Tomato Pasta",
        description: "Delicious wheat pasta infused with real tomato puree.",
        price: 145,
        image: "/WhatsApp Image 2026-02-09 at 1.15.23 PM (1).jpeg",
        category: "Pasta",
        weight: "500g",
    },
    {
        name: "Adai Dosa Mix",
        description: "Traditional Adai Dosa Mix for a healthy and hearty breakfast.",
        price: 95,
        image: "/WhatsApp Image 2026-02-09 at 1.21.53 PM.jpeg",
        category: "Ready to Cook",
        weight: "500g",
    },
    {
        name: "Pesarattu Mix",
        description: "Authentic Pesarattu Mix made from green gram for a nutritious meal.",
        price: 95,
        image: "/WhatsApp Image 2026-02-09 at 1.24.47 PM.jpeg",
        category: "Ready to Cook",
        weight: "500g",
    },
    {
        name: "Dried Moringa Powder",
        description: "Pure dried Moringa powder, a superfood packed with vitamins.",
        price: 150,
        image: "/WhatsApp Image 2026-02-09 at 1.27.22 PM.jpeg",
        category: "Spices & Masalas",
        weight: "500g",
    },
    {
        name: "Karuppu Kavuni (Black Rice)",
        description: "Premium Karuppu Kavuni rice, known for its high antioxidant properties.",
        price: 180,
        image: "/WhatsApp Image 2026-02-09 at 1.29.17 PM.jpeg",
        category: "Rice & Grains",
        weight: "500g",
    },
    {
        name: "Karuppu Kavuni (Black Rice) Pasta",
        description: "Unique pasta made from nutritious Black Rice.",
        price: 160,
        image: "/WhatsApp Image 2026-02-09 at 1.31.08 PM.jpeg",
        category: "Pasta",
        weight: "500g",
        badge: "New"
    },
    {
        name: "Millet Protein Bar",
        description: "Energy-boosting millet protein bar for on-the-go nutrition.",
        price: 40,
        image: "/WhatsApp Image 2026-02-09 at 1.37.41 PM.jpeg",
        category: "Healthy Snacks",
        weight: "30g",
    },
    {
        name: "Chocolate Protein Bar",
        description: "Delicious chocolate protein bar packed with essential nutrients.",
        price: 45,
        image: "/WhatsApp Image 2026-02-09 at 1.39.51 PM.jpeg",
        category: "Healthy Snacks",
        weight: "30g",
    },
    {
        name: "Dates Nutribar",
        description: "Natural sweetness of dates combined with nuts in a healthy bar.",
        price: 40,
        image: "/WhatsApp Image 2026-02-09 at 1.41.30 PM.jpeg",
        category: "Healthy Snacks",
        weight: "30g",
    },
    {
        name: "Ragi Millet",
        description: "Top-quality Ragi (Finger Millet) grains for a wholesome diet.",
        price: 60,
        image: "/WhatsApp Image 2026-02-09 at 1.45.15 PM.jpeg",
        category: "Rice & Grains",
        weight: "500g",
    },
    {
        name: "Barnyard Millet",
        description: "Fiber-rich Barnyard Millet, perfect for rice substitutes.",
        price: 70,
        image: "/WhatsApp Image 2026-02-09 at 1.46.52 PM.jpeg",
        category: "Rice & Grains",
        weight: "500g",
    },
    {
        name: "Foxtail Millet",
        description: "Nutritious Foxtail Millet grains for a balanced meal.",
        price: 70,
        image: "/WhatsApp Image 2026-02-09 at 1.48.09 PM.jpeg",
        category: "Rice & Grains",
        weight: "500g",
    },
    {
        name: "Peanut Butter Classic",
        description: "Classic creamy peanut butter made from roasted peanuts.",
        price: 180,
        image: "/WhatsApp Image 2026-02-09 at 2.02.09 PM.jpeg",
        category: "Spreads",
        weight: "500g",
    },
    {
        name: "Peanut Butter Crunchy",
        description: "Crunchy peanut butter with real peanut pieces for extra texture.",
        price: 190,
        image: "/WhatsApp Image 2026-02-09 at 2.02.38 PM.jpeg",
        category: "Spreads",
        weight: "500g",
    }
];

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Product.deleteMany();

        await Product.insertMany(products);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
