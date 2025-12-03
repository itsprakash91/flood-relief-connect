import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-lg font-semibold mb-2">FloodReliefConnect</h3>
        <p className="text-gray-300 mb-4">
          Empowering communities through timely disaster relief and support.
        </p>

        <div className="flex justify-center space-x-6 mb-4">
          <Link to="/" className="hover:text-yellow-300 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-yellow-300 transition">
            About
          </Link>
          <Link to="/help-requests" className="hover:text-yellow-300 transition">
            Help Requests
          </Link>
          <Link to="/donations" className="hover:text-yellow-300 transition">
            Donate
          </Link>
        </div>

        <hr className="border-gray-500 my-3" />

        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} FloodReliefConnect. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
