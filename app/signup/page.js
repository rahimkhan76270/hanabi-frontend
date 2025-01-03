"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Correct import for app directory
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("https://rahim-khan-iitg-sentiment-analysis.hf.space/signup/", {
        email,
        password
      });
      router.push("/login"); // Works correctly with next/navigation
    } catch (err) {
      setError("Invalid email or password");
      console.error("signup error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Sign Up</h2>

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
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color={"#ffffff"} /> : "Register"}
          </button>
          <p>Password must be at least 8 characters long.<br/>
          Password must contain at least one letter.<br/>
          Password must contain at least one number.
          <br/></p>
          <Link href={'/login/'} className="text-blue-500">Login</Link>
        </form>
      </div>
    </div>
  );
}
