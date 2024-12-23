"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Correct import for app directory
import Link from "next/link";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://rahim-khan-iitg-sentiment-analysis.hf.space/login/", {
        email,
        password,
      });

      // Assuming the backend returns a token
      localStorage.setItem("token", res.data.token);

      // Redirect to the main app page
      router.push("/"); // Works correctly with next/navigation
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login error:", err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Login</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
          >
            Login
          </button>
          <Link href={'/signup/'} className="text-blue-500">Sign up</Link>
        </form>
      </div>
    </div>
  );
}
