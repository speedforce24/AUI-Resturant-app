import { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(""); // Track selected restaurant
  const [foods, setFoods] = useState([]);
  const token = localStorage.getItem("token"); 
  // ✅ Fetch all restaurants
  useEffect(() => {
   axios.get("http://localhost:5000/api/restaurants",{
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Include token in headers
        },
      }) // Ensure this endpoint exists
      .then((res) => {
        console.log("✅ Restaurant Response:", res.data)
        setRestaurants(res.data);
        console.log("Fetched restaurants:", res.data);
      })
      .catch((error) => console.error("Error fetching restaurants:", error));
  }, []);

  // ✅ Fetch food when a restaurant is selected
  useEffect(() => {
    if (!selectedRestaurant) return;

    axios
      .get(`http://localhost:5000/api/foods/${selectedRestaurant}`,{
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Include token in headers
        },
      }) // Ensure this endpoint exists) // Fetch food for selected restaurant
      .then((res) => {
        setFoods(res.data);
        console.log("Fetched foods:", res.data);
      })
      .catch((error) => console.error("Error fetching foods:", error));
  }, [selectedRestaurant]);

  return (
    <div
    className="min-h-screen w-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${process.env.PUBLIC_URL + "/admin.jpg"})` }}
  >
    {/* 🔹 Dropdown & Menu Title in a Row */}
    <div className="flex items-center gap-4 mb-6 bg-white bg-opacity-80 p-4 rounded-lg shadow-lg">
      <h1 className="text-xl font-bold">Select a Restaurant</h1>
      <select
        className="p-2 border rounded"
        value={selectedRestaurant}
        onChange={(e) => setSelectedRestaurant(e.target.value)}
      >
        <option value="">Choose a restaurant</option>
        {restaurants.map((restaurant) => (
          <option key={restaurant._id} value={restaurant.restaurantName}>
            {restaurant.restaurantName}
          </option>
        ))}
      </select>
    </div>
  
    {/* 🔹 Display Food Items */}
    {selectedRestaurant && (
      <div className="w-full max-w-5xl bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
        {/* Centered Menu Title */}
        <h2 className="text-lg font-bold text-center mb-6">{selectedRestaurant} Menu</h2>
  
        {/* Food Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
          {foods.map((food) => (
            <div key={food._id} className="border w-36 h-42 rounded-lg flex flex-col items-center shadow-md p-3 bg-white">
              {/* Image */}
              <img
                src={`http://localhost:5000${food.image}`}
                alt={food.foodName}
                className="w-24 h-24 object-cover rounded-md"
              />
  
              {/* Food Details */}
              <h3 className="text-lg font-bold text-center mt-2">{food.foodName}</h3>
              <p className="text-gray-600 text-center">${food.price}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
  

    
  );
};

export default UserDashboard;
