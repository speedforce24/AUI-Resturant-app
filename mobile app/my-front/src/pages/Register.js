import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role, // Send role selection
      });

      alert(response.data.message);
       // Show success message
       if (response.status === 201) {
       
        navigate("/login"); // Redirect to login page
      }
    } catch (error) {
      alert("Registration failed! " + error.response?.data?.error);
    }
  };
  const navigate = useNavigate();

  return (
<div className=" relative h-screen m-0 p-0 object-contain overflow-hidden w-full bg-cover bg-center bg-no-repeat flex flex-col items-center"style={{ backgroundImage: `url(${process.env.PUBLIC_URL + "/banga.jpg"})` }}>
<h2 className="flex justify-center mb-3 mt-5 font-extrabold p-10 text-[70px] text-white">Register</h2>
      <form onSubmit={handleRegister} >
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="border px-4 text-base h-[60px]  w-[400px] focus:outline-none focus:ring-0 focus:border-yellow-500 rounded-3xl mb-4 mr-2 block" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border px-4 text-base h-[60px]  w-[400px] focus:outline-none focus:ring-0 focus:border-yellow-500 rounded-3xl mb-4 mr-2 block" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="border px-4 text-base h-[60px]  w-[400px] focus:outline-none focus:ring-0 focus:border-yellow-500 rounded-3xl mb-4 mr-2 block" />

        {/* Role Selection */}
        <div className="flex flex-col items-center w-full">
        <select value={role} onChange={(e) => setRole(e.target.value)} required className="rounded-3xl  focus:outline-none block ml-[">
          <option value="user" className="pl-10">User</option>
          <option value="admin" className="ml-2">Admin</option>
        </select>

        <button type="submit" className=" mt-3 bg-yellow-300 border rounded-3xl w-[100px] font-bold">Register</button>
        </div>
      </form>
      <button
      onClick={() => navigate("/login")}
      className="mt-5  bg-black text-white px-4 py-2 rounded-3xl text-center "
    >
      Have an account? Login
    </button>
      
    </div>
  );
};

export default Register;
