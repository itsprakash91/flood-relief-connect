import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide hover:text-yellow-300 transition-colors"
        >
          FloodReliefConnect
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6 hidden md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-yellow-300 transition-colors ${
                isActive ? "text-yellow-300 font-semibold" : ""
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/help-requests"
            className={({ isActive }) =>
              `hover:text-yellow-300 transition-colors ${
                isActive ? "text-yellow-300 font-semibold" : ""
              }`
            }
          >
            Help Requests
          </NavLink>

          <NavLink
            to="/donate"
            className={({ isActive }) =>
              `hover:text-yellow-300 transition-colors ${
                isActive ? "text-yellow-300 font-semibold" : ""
              }`
            }
          >
            Donate
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hover:text-yellow-300 transition-colors ${
                isActive ? "text-yellow-300 font-semibold" : ""
              }`
            }
          >
            About
          </NavLink>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/login"
            className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-all"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-yellow-400 text-blue-900 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition-all"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Mobile menu (optional enhancement) */}
      <div className="md:hidden px-6 pb-3 flex justify-center space-x-4">
        <Link to="/login" className="hover:text-yellow-300">
          Login
        </Link>
        <Link to="/register" className="hover:text-yellow-300">
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
