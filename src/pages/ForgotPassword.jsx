import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = users.findIndex(
        (u) =>
          u.email === email &&
          u.securityAnswer.toLowerCase() === securityAnswer.toLowerCase()
      );

      if (userIndex === -1) {
        toast.error("Email or favorite color is incorrect");
        setLoading(false);
        return;
      }

      users[userIndex].password = newPassword;
      localStorage.setItem("users", JSON.stringify(users));
      toast.success("Password reset successful");
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-sky-200 via-indigo-200 to-violet-200 bg-opacity-50 flex items-center justify-center z-50">
      <div className="p-8 max-w-md mx-auto mt-16 bg-gradient-to-r from-indigo-50 via-sky-50 to-rose-50 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold mb-2 text-blue-700">
          Forgot Password ?
        </h1>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <input
            type="text"
            placeholder="Your favorite color"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 shadow-md text-white p-2 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? <ClipLoader color="#fff" size={20} /> : "Reset Password"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Remember your password?{""}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
