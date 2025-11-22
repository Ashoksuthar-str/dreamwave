// "use client";

// import React, { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// const Page = () => {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "USER",
   
//   });
// const router = useRouter();
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const register = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("/api/register", form);
//       alert("User registered successfully");
//       console.log("all done");
//       router.push("/login");
      
//       console.log(res);
//     } catch (error) {
//       console.log("Error while sending data", error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//           Register User
//         </h2>

//         <form onSubmit={register} className="space-y-4">
//           {/* Name */}
//           <div>
//             <label className="block text-gray-700 mb-1 font-medium">Name</label>
//             <input
//               type="text"
//               name="name"
//               onChange={handleChange}
//               value={form.name}
//               className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
//               placeholder="Enter name"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-gray-700 mb-1 font-medium">Email</label>
//             <input
//               type="email"
//               name="email"
//               onChange={handleChange}
//               value={form.email}
//               className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
//               placeholder="example@gmail.com"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-gray-700 mb-1 font-medium">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               onChange={handleChange}
//               value={form.password}
//               className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
//               placeholder="Enter password"
//             />
//           </div>

          

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all"
//           >
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Page;
"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Briefcase } from "lucide-react";

const Page = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "MANAGER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const register = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await axios.post("/api/register", form);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1200);
      setForm({
        name: "",
        email: "",
        password: "",
        role: "MANAGER",
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error while registering. Please try again.";
      setError(message);
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
            <span className="inline-flex justify-center items-center w-14 h-14 rounded-xl mb-4 bg-[#b976ff] bg-opacity-15">
              <Briefcase className="w-7 h-7 text-[#b976ff]" />
            </span>
            <h2 className="text-2xl font-bold text-white mb-2">Register</h2>
            <p className="text-gray-400 mb-4">Create an account to manage inventory</p>
          </div>
          <form onSubmit={register} className="px-8 pb-8 space-y-5">
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full bg-[#24253A] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#b976ff] outline-none"
                placeholder="Enter name"
                autoComplete="name"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full bg-[#24253A] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#b976ff] outline-none"
                placeholder="example@mail.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full bg-[#24253A] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#b976ff] outline-none"
                placeholder="Create password"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full bg-[#24253A] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#b976ff] outline-none"
              >
                <option value="MANAGER">Manager</option>
                <option value="WORKER">Worker</option>
              </select>
            </div>
            {error && (
              <div className="bg-[#402040] border border-[#b976ff] text-[#ff297a] px-4 py-2 rounded-lg text-sm">{error}</div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                Registration successful! Redirecting...
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#b976ff] to-[#7864EF] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-500 text-xs mt-6">
          Already registered?{" "}
          <a className="text-[#b976ff] hover:underline" href="/login">
            Login here
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
