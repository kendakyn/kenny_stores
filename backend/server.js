const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Multer and file system
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Product = require("./models/Product");

const app = express();

/* ------------------- MIDDLEWARE ------------------- */
app.use(cors());
app.use(express.json()); // body-parser is no longer needed

/* ------------------- UPLOADS FOLDER & MULTER ------------------- */

// Create uploads folder if it doesn't exist
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Serve uploaded images - THIS IS CRITICAL!
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ------------------- DATABASE ------------------- */
mongoose
  .connect("mongodb://127.0.0.1:27017/kennyStore")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

/* ------------------- API ROUTES ------------------- */

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new product (with image upload)
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      image: `/uploads/${req.file.filename}`, // path to uploaded image
      description: req.body.description
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product
app.put("/api/products/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description
    };

    // Only update image if a new one was uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Optional: Delete the image file from uploads folder
    if (deletedProduct.image) {
      const imagePath = path.join(__dirname, deletedProduct.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ------------------- SERVER ------------------- */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});