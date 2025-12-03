import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

import Home from "./pages/Home";
import MapDashboard from "./pages/MapDashboard";
import RequestDetails from "./pages/RequestDetails";
import Donate from "./pages/Donate";
import Profile from "./pages/Profile";
import HelpRequests from "./pages/HelpRequests";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AdminDashboard from "./components/Admin/AdminDashboard";
import CampsManager from "./components/Admin/CampsManager";
import VolunteerDashboard from "./components/Volunteer/VolunteerDashboard";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapDashboard />} />
          <Route path="/help-requests" element={<HelpRequests />} />
          <Route path="/request/:id" element={<RequestDetails />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Volunteer routes */}
          <Route path="/volunteer" element={<VolunteerDashboard />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/camps" element={<CampsManager />} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
