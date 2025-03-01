const express = require("express");
const multer = require("multer");
const path = require("path");
const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant"); // ✅ Import restaurant model
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ✅ Serve uploaded images
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 🔹 Add Food Item (Only Admins) - Ensures restaurant exists
router.post(
  "/foods",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("📥 Received food data:", req.body);
      console.log("🖼 File uploaded:", req.file);

      let { foodName, price, restaurantName } = req.body;

      // 🔴 Validate required fields
      if (!foodName || !price || !restaurantName) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // 🔴 Ensure an image was uploaded
      if (!req.file) {
        return res.status(400).json({ error: "Image upload failed" });
      }

      // 🔹 Check if restaurant exists, else create it
      let restaurant = await Restaurant.findOne({ restaurantName });
      if (!restaurant) {
        restaurant = new Restaurant({ restaurantName });
        await restaurant.save();
        console.log("✅ New restaurant created:", restaurant);
      }
      restaurantName = restaurantName.toString()

      // ✅ Save the food item
      const newFood = new Food({
        foodName,
        price,
        image: `/uploads/${req.file.filename}`,
        restaurantName,
      });

      await newFood.save();
      res.status(201).json({ message: "Food added successfully", food: newFood });
    } catch (err) {
      console.error("❌ Error adding food:", err);
      res.status(500).json({ error: "Failed to upload food", details: err.message });
    }
  }
);

// ✅ Fetch all restaurants
router.get("/restaurants", authMiddleware, async (req, res) => {
  try {
    console.log("📥 Fetching all restaurants...");
    
    const restaurants = await Restaurant.find();
    
    res.json(restaurants);
  } catch (err) {
    console.error("❌ Error fetching restaurants:", err);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

// ✅ Fetch food by restaurant name
router.get("/foods/:restaurantName", authMiddleware, async (req, res) => {
  try {
    console.log("📥 Fetching food for restaurant:", req.params.restaurantName);

    const foods = await Food.find({ restaurantName: req.params.restaurantName });

    res.json(foods);
  } catch (err) {
    console.error("❌ Error fetching food items:", err);
    res.status(500).json({ error: "Failed to fetch food items" });
  }
});

module.exports = router;
