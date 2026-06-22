import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Wishlist from './models/Wishlist.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Wishlist.deleteMany();

    console.log('Database cleared...');

    // 1. Create Users
    const adminUser = await User.create({
      username: 'NebulaAdmin',
      email: 'admin@nebula.com',
      password: 'adminpassword', // Will be hashed via pre-save hook
      isAdmin: true,
    });

    const regularUser = await User.create({
      username: 'CyberShopper',
      email: 'user@nebula.com',
      password: 'userpassword', // Will be hashed via pre-save hook
      isAdmin: false,
    });

    console.log('Users seeded...');

    // 2. Create Categories
    const categories = await Category.insertMany([
      {
        name: 'Cybernetics & Implants',
        description: 'Bio-hacking neural links, optical upgrades, and cybernetic limbs.',
      },
      {
        name: 'Quantum Hardware',
        description: 'Sub-atomic processors, gravity cores, and dark matter batteries.',
      },
      {
        name: 'Tactical Gear & Apparel',
        description: 'Chameleon active-camo cloaks, energy shields, and nanotech suits.',
      },
      {
        name: 'Propulsion & Vehicles',
        description: 'Gravitational hoverboards, plasma thruster thrashers, and warp nodes.',
      },
    ]);

    console.log('Categories seeded...');

    // 3. Create Products
    const productsData = [
      {
        name: 'Neural Link v9.4 (Cortex Edition)',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
        description: 'Direct-to-cortex quantum transceiver. High-speed telemetry logging, multi-thread thoughts coordination, and full-immersion matrix compatibility. Standard surgical implantation required.',
        category: categories[0]._id,
        price: 8999.99,
        countInStock: 12,
        rating: 4.8,
        numReviews: 4,
        reviews: [
          {
            user: regularUser._id,
            name: 'CyberShopper',
            rating: 5,
            comment: 'Zero latency connection! Im browsing the Net with my mind. Highly recommend!',
          },
        ],
      },
      {
        name: 'Cyber-Optic Lens (Neon Cyan)',
        image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
        description: 'Full-spectrum ocular upgrade. Includes 100x zoom, thermo-graphic scanning, threat analysis overlay, and custom HUD theme coloring. Water-resistant up to 100m.',
        category: categories[0]._id,
        price: 2450.0,
        countInStock: 25,
        rating: 4.5,
        numReviews: 2,
      },
      {
        name: 'Sub-Atomic Quantum Core',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
        description: 'A stable quantum vacuum power cell providing virtually infinite electricity for domestic hovercrafts and small space stations. Warning: Do not puncture the plasma seal.',
        category: categories[1]._id,
        price: 19999.99,
        countInStock: 5,
        rating: 4.9,
        numReviews: 5,
      },
      {
        name: 'Nano-Shield Armlet',
        image: 'https://images.unsplash.com/photo-1535303311164-664fc9ec6532?auto=format&fit=crop&w=600&q=80',
        description: 'Wrist-worn device that deploys a localized hexagonal force-field capable of deflecting physical projectiles and dispersed laser fire. Runs on micro-fusion batteries.',
        category: categories[2]._id,
        price: 3800.0,
        countInStock: 15,
        rating: 4.2,
        numReviews: 3,
      },
      {
        name: 'Chameleon Stealth Cloak',
        image: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=600&q=80',
        description: 'Made of active-pixel smart fabric. Dynamically copies background textures for near-perfect visual camouflage. Built-in thermal heat dampeners keep you hidden from scanners.',
        category: categories[2]._id,
        price: 7200.0,
        countInStock: 8,
        rating: 4.7,
        numReviews: 12,
      },
      {
        name: 'Aero-Grav Hoverboard (Neon Edition)',
        image: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=600&q=80',
        description: 'Equipped with dual anti-gravity nodes and jet thrust vectoring. Achieve flight altitudes of up to 5 meters. Synchronizes with your Neural Link for high-speed trick maneuvers.',
        category: categories[3]._id,
        price: 5499.0,
        countInStock: 0, // Out of stock to test ui alerts
        rating: 4.6,
        numReviews: 8,
      },
      {
        name: 'Plasma Impulse Jet thruster',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        description: 'Aftermarket engine upgrade for atmospheric hover-vehicles. Features zero-point fuel injection, super-heated ion stream output, and signature neon purple exhaust trail.',
        category: categories[3]._id,
        price: 15000.0,
        countInStock: 4,
        rating: 4.4,
        numReviews: 6,
      },
    ];

    // Seed products and bind them to the Admin User ID
    const seededProducts = productsData.map((prod) => ({
      ...prod,
      user: adminUser._id,
    }));

    await Product.insertMany(seededProducts);

    console.log('Products seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
