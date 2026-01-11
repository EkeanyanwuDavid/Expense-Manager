import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useContext(AuthContext);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
      if (!user) {
        toast.error("Invalid email or password");
        setLoading(false);
        return;
      }
      setCurrentUser(user);
      toast.success("Login successful");
      navigate("/dashboard");
    }, 1000);
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const credential = credentialResponse?.credential;
    const payload = parseJwt(credential);
    const email = payload?.email;
    if (!email) {
      toast.error("Unable to get Google account email");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find((u) => u.email === email);
    const name = payload?.name || "";
    const picture = payload?.picture || "";

    if (!user) {
      user = { email, password: "", name, picture };
      users.push(user);
    } else {
      // update existing user with google info if missing
      let changed = false;
      if (!user.name && name) {
        user.name = name;
        changed = true;
      }
      if (!user.picture && picture) {
        user.picture = picture;
        changed = true;
      }
      if (changed) {
        // replace in users array
        const idx = users.findIndex((u) => u.email === user.email);
        if (idx >= 0) users[idx] = user;
      }
    }

    localStorage.setItem("users", JSON.stringify(users));

    setCurrentUser(user);
    toast.success("Logged in with Google");
    navigate("/dashboard");
  };

  const handleGoogleError = () => {
    toast.error("Google login failed");
  };
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-sky-200 via-indigo-200 to-violet-200 bg-opacity-50 flex items-center justify-center z-50">
      <div className="p-8 max-w-md mx-auto mt-16 bg-gradient-to-r from-indigo-50 via-sky-50 to-rose-50 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold mb-2 text-sky-700">Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
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

          <button
            type="submit"
            className="w-full text-white p-3 rounded-lg flex items-center justify-center bg-gradient-to-r from-sky-600 to-indigo-500 hover:from-sky-700 hover:to-indigo-600 shadow-md"
            disabled={loading}
          >
            {loading ? <ClipLoader color="#fff" size={20} /> : "Login"}
          </button>
        </form>
        <p
          className="mt-2 text-blue-500 cursor-pointer hover:underline text-center"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password
        </p>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300 " />
        </div>

        <div className="w-full flex flex-col items-center">
          {clientId ? (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          ) : (
            <div className="w-full text-center">
              <button
                disabled
                className="w-full bg-red-400 text-white p-2 rounded-lg flex items-center justify-center space-x-2 opacity-80"
              >
                <FaGoogle />
                <span>Google login unavailable</span>
              </button>
              <p className="text-xs text-gray-600 mt-2">
                Missing `VITE_GOOGLE_CLIENT_ID`. Add it to a `.env` file at
                project root and restart the dev server.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
