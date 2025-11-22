"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";

const Page = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await axios.post("/api/login", form);
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1200);
      setForm({
        email: "",
        password: "",
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Invalid email or password. Please try again.";
      setError(message);
      console.log("Error while login", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#24253A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#292b3b] rounded-xl shadow-lg border border-gray-800">
          {/* Header */}
          <div className="text-center px-8 pt-8">
            <span className="inline-flex w-14 h-14 justify-center items-center rounded-xl mb-4 bg-[#b976ff] bg-opacity-15">
              <Lock className="w-7 h-7 text-[#b976ff]" />
            </span>
            <h2 className="text-2xl font-bold text-white mb-2">Login</h2>
            <p className="text-gray-400 mb-4">Sign in to StockMaster</p>
          </div>
          <form onSubmit={login} className="px-8 pb-8 space-y-5">
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Mail className="h-5 w-5 text-[#b976ff]" />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-[#24253A] border border-gray-700 rounded-lg px-10 py-2 text-white focus:ring-2 focus:ring-[#b976ff] outline-none placeholder-gray-400"
                  placeholder="example@mail.com"
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-[#b976ff]" />
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-[#24253A] border border-gray-700 rounded-lg px-10 py-2 text-white focus:ring-2 focus:ring-[#b976ff] outline-none placeholder-gray-400"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-[#402040] border border-[#b976ff] text-[#ff297a] px-4 py-2 rounded-lg text-sm">{error}</div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                Login successful! Redirecting...
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#b976ff] to-[#7864EF] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-500 text-xs mt-6">
          New to StockMaster?{" "}
          <a className="text-[#b976ff] hover:underline" href="/register">
            Register here
          </a>
        </p>
        <p className="text-center text-gray-600 text-xs mt-2">
          © 2025 StockMaster. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Page;
