import React, { useState, useContext } from "react";
import { FaSignOutAlt, FaBars } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  if (!currentUser) return null;

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? "bg-indigo-700" : "hover:bg-indigo-500/30"
    }`;

  const email = currentUser?.email || "User";
  const name = currentUser?.name || "";
  const picture = currentUser?.picture || "";
  const initial = (name || email).charAt(0).toUpperCase();

  return (
    <nav className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden text-white"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            <FaBars />
          </button>
          <h1
            onClick={() => navigate("/dashboard")}
            className="text-lg font-bold cursor-pointer"
          >
            Expense Manager
          </h1>
        </div>

        <div className={`hidden md:flex items-center space-x-4`}>
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/expenses" className={linkClass}>
            Expenses
          </NavLink>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {picture ? (
                <img
                  src={picture}
                  alt={email}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-indigo-800 flex items-center justify-center text-white font-semibold">
                  {initial}
                </div>
              )}
              <div className="text-sm truncate max-w-xs">{name || email}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-md hover:bg-white/10"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mt-2 px-2 pb-3 space-y-1">
          <NavLink
            to="/dashboard"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/expenses"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            Expenses
          </NavLink>
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center space-x-3">
              {picture ? (
                <img
                  src={picture}
                  alt={email}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center text-white font-semibold">
                  {initial}
                </div>
              )}
              <div className="text-sm">{name || email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-white/10"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
