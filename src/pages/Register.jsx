import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password || !confirmPassword) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      if (users.find((u) => u.email === email)) {
        toast.error("Email already registered");
        setLoading(false);
        return;
      }

      users.push({ email, password });
      localStorage.setItem("users", JSON.stringify(users));
      toast.success("Registration successful! Please login.");
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-sky-200 via-indigo-200 to-violet-200 bg-opacity-50 flex items-center justify-center z-50">
      <div className="p-8 max-w-md mx-auto mt-16 bg-gradient-to-r from-indigo-50 via-sky-50 to-rose-50 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold mb-2 text-indigo-700">
          Create account
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Join and start tracking your expenses.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />

          <button
            type="submit"
            className="w-full text-white p-3 rounded-lg flex items-center justify-center bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 shadow-md"
            disabled={loading}
          >
            {loading ? <ClipLoader color="#fff" size={20} /> : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
