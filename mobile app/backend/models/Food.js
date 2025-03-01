const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: false },
  restaurantName: { type: String, required: true }, // ✅ Store the restaurant name instead of ID
});

module.exports = mongoose.model("Food", FoodSchema);
