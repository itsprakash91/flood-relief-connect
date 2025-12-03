import React, { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../api/auth";
import { toast } from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("flood_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("flood_token") || null);

  useEffect(() => {
    if (user) localStorage.setItem("flood_user", JSON.stringify(user));
    else localStorage.removeItem("flood_user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("flood_token", token);
    else localStorage.removeItem("flood_token");
  }, [token]);

  const login = async (email, password) => {
    try {
      // yahan object pass karo
      const res = await loginUser({ email, password }); // ✅

      if (res && res.success) {
        setUser(res.user);
        setToken(res.accessToken);
        toast.success("Logged in successfully!");
      } else {
        throw new Error(res?.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || err.message || "Invalid credentials"
      );
      throw err;
    }
  };


  const register = async (formData) => {
    try {
      const res = await registerUser(formData);
      if (res && res.success) {
        setUser(res.user);
        setToken(res.accessToken);
        toast.success("Account created successfully!");
      } else {
        throw new Error(res?.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    toast("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
