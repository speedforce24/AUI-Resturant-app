import React, { useState } from "react";
import axios from "axios";

const Admin = () => {
  const [restaurantName, setRestaurantName] = useState(""); // ✅ Change this from restaurantId
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [foods, setFoods] = useState([]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("restaurantName", restaurantName); // ✅ Send correct key
    formData.append("foodName", foodName);
    formData.append("price", price);
    formData.append("image", image);

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No Token Found in Local Storage. Please log in again.");
      return;
    }

    try {
      console.log("Token being sent:", token);

      const res = await axios.post(
        "http://localhost:5000/api/foods",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFoods([...foods, res.data.food]); // ✅ Use res.data.food to store the new item
      console.log("✅ Food added successfully:", res.data);
    } catch (err) {
      console.error("❌ Error adding food:", err.response?.data || err.message);
    }
  };

  return (
    <div
  className="h-screen w-full relative object-contain flex items-center justify-center bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: `url(${process.env.PUBLIC_URL + "/admin.jpg"})` }}
>
  <div className="p-6 max-w-lg w-full bg-white bg-opacity-80 rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold text-center">Admin Panel</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Restaurant Name"
        value={restaurantName}
        onChange={(e) => setRestaurantName(e.target.value)}
        className="border p-2 w-full rounded-3xl"
        required
      />
      <input
        type="text"
        placeholder="Food Name"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
        className="border p-2 w-full rounded-3xl"
        required
      />
      <input
        type="text"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border p-2 w-full rounded-3xl"
        required
      />
       <input
    type="file"
    id="file-upload"
    onChange={handleImageChange}
    className="hidden" // ✅ Hide default file input
    required
  />
  
  {/* Custom Upload Button */}
  <label
    htmlFor="file-upload"
   className="mt-5 bg-yellow-500 text-white px-4 py-2 rounded-3xl text-center cursor-pointer inline-block"
  >
     food image
  </label>

      <button type="submit" className="bg-yellow-500 text-white px-4 py-2 w-full rounded-3xl">
        Add Food
      </button>
    </form>
  </div>
</div>

  );
};

export default Admin;
