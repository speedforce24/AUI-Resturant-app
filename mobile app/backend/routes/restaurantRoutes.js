const express = require("express");
const Restaurant = require("../models/Restaurant");

const router = express.Router();

// ✅ Get All Restaurants
router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    console.error("❌ Error fetching restaurants:", err);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

module.exports = router;
