import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ Prevent default form behavior

    try {
      console.log("🔍 Sending Login Request:", { email, password });

      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      const token = res.data.token; // ✅ Extract token properly
      console.log("✅ Token received:", token);

      if (token) {
        localStorage.setItem("token", token);
        console.log("🔍 Received Role:", res.data.role);
        res.data.role === "admin" ? navigate("/admin") : navigate("/user");
      } else {
        console.error("❌ No token received");
        alert("Login failed! Invalid credentials.");
      }
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data || err.message);
      alert("Login failed! " + (err.response?.data?.error || "Try again."));
    }
  };

  return (
    <div
      className="relative h-screen m-0 p-0 object-contain overflow-hidden w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL + "/plantain.jpg"})` }}
    >
      <h2 className="flex justify-center mb-3 mt-5 font-extrabold p-10 text-[70px] text-white">Login</h2>

      <div className="flex flex-col items-center">
        <form onSubmit={handleLogin} className="flex flex-col items-center">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-4 text-base h-[60px] w-[400px] focus:outline-none focus:ring-0 focus:border-yellow-500 rounded-3xl mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border text-base px-4 h-[60px] w-[400px] focus:outline-none focus:ring-0 focus:border-yellow-500 rounded-3xl mb-4"
            required
          />
          <button type="submit" className="mt-3 bg-yellow-300 border rounded-3xl w-[100px] font-bold">
            Login
          </button>
        </form>
        <Link to="/register" className="font-semibold mt-2">
          Don't have an account? Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
