// backend/data/seedProducts.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/productModel.js";

dotenv.config();

// CONNECT TO MONGO
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error("Mongo Connection Failed:", error);
        process.exit(1);
    }
};

// SAMPLE PRODUCTS
const products = [
    {
        name: "iPhone 15",
        price: 1299,
        category: "Phones",
        image: "/images/iphone15.jpg",
        description: "Apple iPhone 15 with A17 chip and improved camera."
    },
    {
        name: "Samsung Galaxy S23",
        price: 1099,
        category: "Phones",
        image: "/images/s23.jpg",
        description: "Samsung flagship phone with top performance."
    },
    {
        name: "Dell XPS 15",
        price: 1899,
        category: "Laptops",
        image: "/images/dellxps.jpg",
        description: "Premium Windows laptop with stunning display."
    },
    {
        name: "Sony WH-1000XM5",
        price: 349,
        category: "Accessories",
        image: "/images/sonyxm5.jpg",
        description: "Industry-leading noise-canceling headphones."
    }
];

// IMPORT FUNCTION
const seedProducts = async () => {
    try {
        await connectDB();

        console.log("Deleting existing products...");
        await Product.deleteMany();

        console.log("Inserting sample products...");
        await Product.insertMany(products);

        console.log("Products Seeded Successfully!");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedProducts();
